import {createContext,useContext,useState,useEffect,useRef,useCallback,type ReactNode} from 'react';
import type {SchoolGroup,StudentAccount,StudentDraft,RememberedStudentCard,InitialRoster} from '../types/system';
import {loadActiveSchool,saveActiveSchool,loadSchools,saveSchools,loadStudents,saveStudents,loadRememberedStudents,saveRememberedCard,removeRememberedCard,clearRememberedCards,deleteStudentData} from '../utils/storageEngine';
import {hashPin,verifyPin,generateSalt} from '../utils/cryptoPin';
import {clearSnapshot,flushBrownoutSnapshot} from '../utils/brownoutManager';
import {stopSpeech} from '../utils/speechTts';
interface AuthState {ready:boolean;error:string;activeSchoolCode:string|null;activeSchool:SchoolGroup|null;schools:SchoolGroup[];students:StudentAccount[];activeStudent:StudentAccount|null;rememberedStudents:RememberedStudentCard[];isAuthenticated:boolean;isTeacherMode:boolean;setSchoolCode:(code:string)=>boolean;switchSchool:()=>void;loginStudent:(id:string,pin:string)=>Promise<boolean>;logoutStudent:()=>void;loginTeacher:(pin:string)=>Promise<boolean>;logoutTeacher:()=>void;saveStudent:(draft:StudentDraft,id?:string)=>Promise<StudentAccount>;deleteStudent:(id:string)=>Promise<void>;resetPin:(id:string,pin:string)=>Promise<void>;updateStudent:(id:string,patch:Partial<Pick<StudentAccount,'gradeLevel'|'isHighSchoolFoundations'|'displayName'|'avatarId'>>)=>void;removeRememberedStudent:(id:string)=>void;purgeRemembered:()=>void;createSchool:(code:string,name:string,pin:string)=>Promise<void>;renameSchool:(name:string)=>void}
const Context=createContext<AuthState|null>(null);
let seedPromise:Promise<InitialRoster>|null=null;
export function AuthProvider({children,initialRoster}:{children:ReactNode;initialRoster?:()=>Promise<InitialRoster>}) {
 const [ready,setReady]=useState(false);const [error,setError]=useState('');const [schools,setSchools]=useState(loadSchools);const [students,setStudents]=useState(loadStudents);const [activeSchoolCode,setCode]=useState(loadActiveSchool);const [activeStudent,setActive]=useState<StudentAccount|null>(null);const [rememberedStudents,setCards]=useState(loadRememberedStudents);const [isTeacherMode,setTeacher]=useState(false);
 const authGeneration=useRef(0);
 useEffect(()=>()=>{authGeneration.current++},[]);
 const refreshCards=()=>setCards(loadRememberedStudents());
 useEffect(()=>{let live=true;(async()=>{try{if(!loadSchools().length&&initialRoster){seedPromise??=initialRoster();const seed=await seedPromise;if(!loadSchools().length){saveSchools([seed.school]);saveStudents(seed.students);saveActiveSchool(seed.school.schoolCode);for(const student of seed.students)saveRememberedCard(student)}}
 if(live){setSchools(loadSchools());setStudents(loadStudents());setCode(loadActiveSchool());refreshCards()}}catch(e){if(live)setError(e instanceof Error?e.message:'This device could not save your school.')}finally{if(live)setReady(true)}})();return()=>{live=false}},[initialRoster]);
 const logoutStudent=useCallback(()=>{authGeneration.current++;flushBrownoutSnapshot();setActive(s=>{if(s)clearSnapshot(s.studentId);return null});stopSpeech()},[]);
 const lastActivity=useRef(Date.now());
 useEffect(()=>{if(!activeStudent&&!isTeacherMode)return;lastActivity.current=Date.now();const touch=()=>{lastActivity.current=Date.now()};const events=['pointerdown','pointermove','touchstart','keydown'];for(const e of events)window.addEventListener(e,touch,{passive:true});const timer=setInterval(()=>{if(Date.now()-lastActivity.current>=1800000){logoutStudent();setTeacher(false)}},1000);return()=>{clearInterval(timer);for(const e of events)window.removeEventListener(e,touch)}},[activeStudent,isTeacherMode,logoutStudent]);
 const activeSchool=schools.find(s=>s.schoolCode===activeSchoolCode)??null;
 function persistStudents(next:StudentAccount[]) {saveStudents(next);setStudents(next);setActive(s=>s?next.find(n=>n.studentId===s.studentId)??null:null)}
 function updateStudent(id:string,patch:Partial<Pick<StudentAccount,'gradeLevel'|'isHighSchoolFoundations'|'displayName'|'avatarId'>>) {
 if(!isTeacherMode&&id!==activeStudent?.studentId)throw new Error('Open teacher access first.');
 if(!isTeacherMode&&Object.keys(patch).some(k=>k!=='isHighSchoolFoundations'))throw new Error('Only a teacher can change this.');
 const current=students.find(s=>s.studentId===id&&s.schoolCode===activeSchoolCode);if(!current)throw new Error('Student not found.');
 const updated={...current,...patch};if(updated.gradeLevel!=='highschool')updated.isHighSchoolFoundations=false;
 persistStudents(students.map(s=>s.studentId===id?updated:s));if(rememberedStudents.some(c=>c.studentId===id))saveRememberedCard(updated);refreshCards();
 }
 async function saveStudent(draft:StudentDraft,id?:string):Promise<StudentAccount> {
 if(!activeSchool||(!isTeacherMode&&(id!==undefined||!activeSchool.allowSelfRegistration)))throw new Error('Ask your teacher to add a student.');
 const name=draft.displayName.trim();if(name.length<2||name.length>50)throw new Error('Use a name with 2 to 50 letters.');
 const current=id?students.find(s=>s.studentId===id&&s.schoolCode===activeSchoolCode):undefined;if(id&&!current)throw new Error('Student not found.');
 if(students.some(s=>s.schoolCode===activeSchoolCode&&s.studentId!==id&&s.displayName.toLowerCase()===name.toLowerCase()))throw new Error('That name is in use. Add a last name.');
 if(!current&&students.filter(s=>s.schoolCode===activeSchoolCode).length>=activeSchool.maxStudents)throw new Error('The class is full.');
 let pinSalt=current?.pinSalt??generateSalt();let pinHash=current?.pinHash??'';if(draft.pin){pinSalt=generateSalt();pinHash=await hashPin(draft.pin,pinSalt)}if(!pinHash)throw new Error('Set a four-number PIN.');
 const account:StudentAccount={studentId:current?.studentId??crypto.randomUUID(),schoolCode:activeSchool.schoolCode,displayName:name,gradeLevel:draft.gradeLevel,isHighSchoolFoundations:draft.gradeLevel==='highschool'&&draft.isHighSchoolFoundations,avatarId:draft.avatarId,pinHash,pinSalt,createdAt:current?.createdAt??new Date().toISOString(),lastLoginAt:current?.lastLoginAt??''};
 persistStudents(current?students.map(s=>s.studentId===id?account:s):[...students,account]);if(current&&rememberedStudents.some(c=>c.studentId===id))saveRememberedCard(account);refreshCards();return account;
 }
 const value:AuthState={ready,error,activeSchoolCode,activeSchool,schools,students,activeStudent,rememberedStudents,isAuthenticated:!!activeStudent,isTeacherMode,
 setSchoolCode:raw=>{const code=raw.trim().toUpperCase();if(!schools.some(s=>s.schoolCode===code))return false;logoutStudent();setTeacher(false);saveActiveSchool(code);setCode(code);return true},
 switchSchool:()=>{logoutStudent();setTeacher(false);saveActiveSchool(null);setCode(null)},
 loginStudent:async(id,pin)=>{const generation=++authGeneration.current;const student=students.find(s=>s.studentId===id&&s.schoolCode===activeSchoolCode);if(!student||!(await verifyPin(pin,student.pinHash,student.pinSalt))||generation!==authGeneration.current)return false;const updated={...student,lastLoginAt:new Date().toISOString()};persistStudents(students.map(s=>s.studentId===id?updated:s));saveRememberedCard(updated);refreshCards();setActive(updated);setTeacher(false);return true},
 logoutStudent,
 loginTeacher:async pin=>{const generation=++authGeneration.current;if(!activeSchool||!await verifyPin(pin,activeSchool.adminPasscodeHash,activeSchool.adminPasscodeSalt)||generation!==authGeneration.current)return false;logoutStudent();setTeacher(true);return true},logoutTeacher:()=>{authGeneration.current++;setTeacher(false)},saveStudent,
 deleteStudent:async id=>{if(!isTeacherMode)throw new Error('Open teacher access first.');if(!students.some(s=>s.studentId===id&&s.schoolCode===activeSchoolCode))throw new Error('Student not found.');persistStudents(students.filter(s=>s.studentId!==id));removeRememberedCard(id);refreshCards();clearSnapshot(id);await deleteStudentData(id)},
 resetPin:async(id,pin)=>{if(!isTeacherMode)throw new Error('Open teacher access first.');const student=students.find(s=>s.studentId===id&&s.schoolCode===activeSchoolCode);if(!student)throw new Error('Student not found.');const pinSalt=generateSalt();const pinHash=await hashPin(pin,pinSalt);persistStudents(students.map(s=>s.studentId===id?{...s,pinSalt,pinHash}:s))},updateStudent,
 removeRememberedStudent:id=>{removeRememberedCard(id);refreshCards()},purgeRemembered:()=>{clearRememberedCards();refreshCards()},
 createSchool:async(raw,name,pin)=>{const code=raw.trim().toUpperCase();if(!/^[A-Z0-9_-]{3,20}$/.test(code))throw new Error('Use 3 to 20 letters, numbers, or dashes.');if(schools.some(s=>s.schoolCode===code))throw new Error('That code is in use.');if(name.trim().length<2)throw new Error('Enter a school or family name.');const salt=generateSalt();const school:SchoolGroup={schoolCode:code,displayName:name.trim(),adminEmail:'',adminPasscodeHash:await hashPin(pin,salt),adminPasscodeSalt:salt,createdAt:new Date().toISOString(),maxStudents:100,allowSelfRegistration:false};const next=[...schools,school];saveSchools(next);setSchools(next);logoutStudent();saveActiveSchool(code);setCode(code);setTeacher(true)},
 renameSchool:name=>{if(!isTeacherMode||!activeSchool)throw new Error('Open teacher access first.');if(name.trim().length<2)throw new Error('Enter a name.');const next=schools.map(s=>s.schoolCode===activeSchoolCode?{...s,displayName:name.trim()}:s);saveSchools(next);setSchools(next)}
 };
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAuth(){const c=useContext(Context);if(!c)throw new Error('AuthProvider is required.');return c}
