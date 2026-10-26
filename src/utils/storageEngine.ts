import type {SchoolGroup,StudentAccount,RememberedStudentCard,UserProgress,OfflineMutation} from '../types/system';
export const STORAGE_KEYS={school:'pupil_active_school_code',cards:'pupil_remembered_students',schools:'pupil_school_groups',students:'pupil_student_accounts',progress:'pupil_student_progress_map',queue:'pupil_offline_mutation_queue'} as const;
export function readStored<T>(key:string,fallback:T):T {try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw) as T:fallback}catch{return fallback}}
export function writeStored(key:string,value:unknown):boolean {try{localStorage.setItem(key,JSON.stringify(value));return true}catch{if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('pupil-storage-warning'));return false}}
export function loadActiveSchool():string|null {try{return localStorage.getItem(STORAGE_KEYS.school)}catch{return null}}
export function saveActiveSchool(code:string|null):void {try{if(code)localStorage.setItem(STORAGE_KEYS.school,code);else localStorage.removeItem(STORAGE_KEYS.school)}catch{window.dispatchEvent(new CustomEvent('pupil-storage-warning'))}}
export function loadSchools():SchoolGroup[] {const data=readStored<SchoolGroup[]>(STORAGE_KEYS.schools,[]);return Array.isArray(data)?data:[]}
export function saveSchools(schools:SchoolGroup[]):void {if(!writeStored(STORAGE_KEYS.schools,schools))throw new Error('This device cannot save the school. Free some space and try again.')}
export function loadStudents():StudentAccount[] {const data=readStored<StudentAccount[]>(STORAGE_KEYS.students,[]);return Array.isArray(data)?data:[]}
export function saveStudents(students:StudentAccount[]):void {if(!writeStored(STORAGE_KEYS.students,students))throw new Error('This device cannot save the student. Free some space and try again.')}
export function loadRememberedStudents():RememberedStudentCard[] {const cards=readStored<RememberedStudentCard[]>(STORAGE_KEYS.cards,[]);return Array.isArray(cards)?cards.filter(c=>c&&typeof c.studentId==='string').slice(0,20):[]}
export function saveRememberedCard(student:RememberedStudentCard):void {
 const {studentId,schoolCode,displayName,gradeLevel,isHighSchoolFoundations,avatarId,lastLoginAt}=student;
 const card={studentId,schoolCode,displayName,gradeLevel,isHighSchoolFoundations,avatarId,lastLoginAt};
 const cards=loadRememberedStudents().filter(c=>c.studentId!==studentId);cards.unshift(card);
 cards.sort((a,b)=>Date.parse(b.lastLoginAt)-Date.parse(a.lastLoginAt));writeStored(STORAGE_KEYS.cards,cards.slice(0,20));
}
export function removeRememberedCard(id:string):void {writeStored(STORAGE_KEYS.cards,loadRememberedStudents().filter(c=>c.studentId!==id))}
export function clearRememberedCards():void {writeStored(STORAGE_KEYS.cards,[])}
const stores=['progress_store','brownout_store','mutation_queue'] as const;
type Store=typeof stores[number];
let dbPromise:Promise<IDBDatabase>|null=null;
function openDb():Promise<IDBDatabase> {
 if(dbPromise)return dbPromise;
 dbPromise=new Promise((resolve,reject)=>{
 if(typeof indexedDB==='undefined'){reject(new Error('Local database is not available.'));return}
 const request=indexedDB.open('pupil-ph',1);
 request.onupgradeneeded=()=>{for(const name of stores)if(!request.result.objectStoreNames.contains(name))request.result.createObjectStore(name)};
 request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();dbPromise=null};resolve(db)};request.onerror=()=>reject(request.error);request.onblocked=()=>reject(new Error('Close the other Pupil tab and try again.'));
 });dbPromise.catch(()=>{dbPromise=null});return dbPromise;
}
export async function idbPut(store:Store,key:string,value:unknown):Promise<void> {
 const db=await openDb();await new Promise<void>((resolve,reject)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).put(value,key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)});
}
export async function idbGet<T>(store:Store,key:string):Promise<T|undefined> {const db=await openDb();return new Promise((resolve,reject)=>{const req=db.transaction(store).objectStore(store).get(key);req.onsuccess=()=>resolve(req.result as T|undefined);req.onerror=()=>reject(req.error)})}
export async function idbDelete(store:Store,key:string):Promise<void> {const db=await openDb();await new Promise<void>((resolve,reject)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).delete(key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}
async function idbAll<T>(store:Store):Promise<T[]> {const db=await openDb();return new Promise((resolve,reject)=>{const req=db.transaction(store).objectStore(store).getAll();req.onsuccess=()=>resolve(req.result as T[]);req.onerror=()=>reject(req.error)})}
export function createEmptyProgress(studentId:string):UserProgress {return {studentId,completedLessons:[],typingProgress:{unlockedStage:1,completedDrills:{}},gameScores:{jeepneyWordExpress:{highScore:0,starsTotal:0,roundsCompleted:0},mangoCatcher:{highScore:0,maxStreak:0,roundsCompleted:0},sentenceBuilder:{solvedSentences:[],starsTotal:0},techDetective:{solvedMissions:[],badgesEarned:[]}},totalPoints:0,currentStreakDays:0,lastActiveDate:''}}
export function loadProgressSync(studentId:string):UserProgress {return readStored<Record<string,UserProgress>>(STORAGE_KEYS.progress,{})[studentId]??createEmptyProgress(studentId)}
export async function loadProgress(studentId:string):Promise<UserProgress|null> {const local=readStored<Record<string,UserProgress>>(STORAGE_KEYS.progress,{})[studentId];if(local)return local;try{return await idbGet<UserProgress>('progress_store',studentId)??null}catch{return null}}
let writes:Promise<void>=Promise.resolve();
// Session tombstones reject late callbacks after account removal. UUIDs are never reused.
const deletedStudents=new Set<string>();
export function saveProgressSnapshot(progress:UserProgress):Promise<void> {
 if(deletedStudents.has(progress.studentId))return Promise.resolve();
 const map=readStored<Record<string,UserProgress>>(STORAGE_KEYS.progress,{});map[progress.studentId]=progress;const localOk=writeStored(STORAGE_KEYS.progress,map);
 const captured=JSON.parse(JSON.stringify(progress)) as UserProgress;
 const mutation:OfflineMutation={id:crypto.randomUUID(),studentId:progress.studentId,progress:captured,timestamp:Date.now(),attempts:0};
 const queue=readStored<OfflineMutation[]>(STORAGE_KEYS.queue,[]);queue.push(mutation);writeStored(STORAGE_KEYS.queue,queue);
 writes=writes.catch(()=>{}).then(async()=>{
  try {await idbPut('progress_store',progress.studentId,captured);await idbPut('mutation_queue',mutation.id,mutation)}catch(e){if(!localOk)throw e}
 });return writes;
}
export async function getOfflineMutationQueue():Promise<OfflineMutation[]> {
 await writes.catch(()=>{});const local=readStored<OfflineMutation[]>(STORAGE_KEYS.queue,[]);try{const all=await idbAll<OfflineMutation>('mutation_queue');return Array.from(new Map([...local,...all].map(m=>[m.id,m])).values())}catch{return local}
}
let flushing:Promise<void>|null=null;let retryTimer:ReturnType<typeof setTimeout>|undefined;let retryDelay=1000;
export function flushOfflineMutationQueue():Promise<void> {
 if(flushing)return flushing;if(typeof navigator!=='undefined'&&!navigator.onLine)return Promise.resolve();
 flushing=(async()=>{const queue=await getOfflineMutationQueue();for(const mutation of queue){
  // Local-only installation: acknowledge only after progress is durable. Never claim cloud sync.
  if(!deletedStudents.has(mutation.studentId)){const current=await loadProgress(mutation.studentId)??mutation.progress;if(!deletedStudents.has(mutation.studentId))await idbPut('progress_store',mutation.studentId,current);}
  await idbDelete('mutation_queue',mutation.id);
  writeStored(STORAGE_KEYS.queue,readStored<OfflineMutation[]>(STORAGE_KEYS.queue,[]).filter(m=>m.id!==mutation.id));
 }retryDelay=1000;window.dispatchEvent(new CustomEvent('pupil-queue-flushed'))})().catch(()=>{
 if(!retryTimer){retryTimer=setTimeout(()=>{retryTimer=undefined;void flushOfflineMutationQueue()},retryDelay);retryDelay=Math.min(retryDelay*2,60000)}
 }).finally(()=>{flushing=null});
 return flushing;
}
export async function deleteStudentData(id:string):Promise<void> {
 deletedStudents.add(id);
 const map=readStored<Record<string,UserProgress>>(STORAGE_KEYS.progress,{});delete map[id];writeStored(STORAGE_KEYS.progress,map);
 writeStored(STORAGE_KEYS.queue,readStored<OfflineMutation[]>(STORAGE_KEYS.queue,[]).filter(m=>m.studentId!==id));
 // Finish both previously queued writes and any reconciliation before deleting durable data.
 await writes.catch(()=>{});if(flushing)await flushing;
 try{await idbDelete('progress_store',id);for(const m of await idbAll<OfflineMutation>('mutation_queue'))if(m.studentId===id)await idbDelete('mutation_queue',m.id)}catch{/* Local roster removal still succeeds when the database is unavailable. */}
}
if(typeof window!=='undefined')window.addEventListener('online',()=>{void flushOfflineMutationQueue()});
