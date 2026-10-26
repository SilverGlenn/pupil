import type {BrownoutSnapshot} from '../types/system';
import {readStored,writeStored,idbPut,idbDelete,idbGet} from './storageEngine';
const pending=new Map<string,BrownoutSnapshot>();let timer:ReturnType<typeof setTimeout>|undefined;
const key=(id:string)=>'pupil_brownout_'+id;
export function recordBrownoutSnapshot(snapshot:BrownoutSnapshot):void {pending.set(snapshot.studentId,{...snapshot,timestamp:Date.now()});if(!timer)timer=setTimeout(flushBrownoutSnapshot,3000)}
export function flushBrownoutSnapshot():void {if(timer)clearTimeout(timer);timer=undefined;for(const [id,snapshot] of pending){writeStored(key(id),snapshot);void idbPut('brownout_store',id,snapshot).catch(()=>{})}pending.clear()}
function validateSnapshot(snapshot:BrownoutSnapshot|null|undefined,studentId:string):BrownoutSnapshot|null {if(!snapshot||snapshot.studentId!==studentId||!Number.isFinite(snapshot.timestamp)||Date.now()-snapshot.timestamp>7200000||snapshot.timestamp>Date.now()+60000)return null;return snapshot}
export function getBrownoutSnapshot(studentId:string):BrownoutSnapshot|null {return validateSnapshot(readStored<BrownoutSnapshot|null>(key(studentId),null),studentId)}
export async function getBrownoutSnapshotAsync(studentId:string):Promise<BrownoutSnapshot|null> {const local=getBrownoutSnapshot(studentId);if(local)return local;try{return validateSnapshot(await idbGet<BrownoutSnapshot>('brownout_store',studentId),studentId)}catch{return null}}
export function clearSnapshot(studentId:string):void {pending.delete(studentId);try{localStorage.removeItem(key(studentId))}catch{/* Browser may deny storage. */}void idbDelete('brownout_store',studentId).catch(()=>{});if(pending.size===0&&timer){clearTimeout(timer);timer=undefined}}
if(typeof window!=='undefined'){window.addEventListener('pagehide',flushBrownoutSnapshot);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flushBrownoutSnapshot()})}
