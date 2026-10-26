import {it,expect,vi,afterEach} from 'vitest';
import {act} from '@testing-library/react';
import * as pins from '../src/utils/cryptoPin';
import * as storage from '../src/utils/storageEngine';
import {ProgressProvider,useProgress} from '../src/context/ProgressContext';
import type {BrownoutSnapshot} from '../src/types/system';
afterEach(()=>vi.restoreAllMocks());
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import {AuthProvider,useAuth} from '../src/context/AuthContext';
import {StageThemeProvider,useStageTheme} from '../src/context/StageThemeContext';
import {hashPin,generateSalt} from '../src/utils/cryptoPin';
import {saveSchools,saveStudents,saveActiveSchool} from '../src/utils/storageEngine';
async function seed(){const salt=generateSalt();const pinHash=await hashPin('0000',salt);saveSchools(['TEST','OTHER'].map(schoolCode=>({schoolCode,displayName:'Test School',adminEmail:'',adminPasscodeHash:pinHash,adminPasscodeSalt:salt,createdAt:'',maxStudents:10})));saveStudents([{studentId:'mark',schoolCode:'TEST',displayName:'Mark Santos',gradeLevel:'highschool',isHighSchoolFoundations:true,pinHash,pinSalt:salt,avatarId:'eagle',createdAt:'',lastLoginAt:''},{studentId:'other',schoolCode:'OTHER',displayName:'Other Student',gradeLevel:'preschool',isHighSchoolFoundations:false,pinHash,pinSalt:salt,avatarId:'mango',createdAt:'',lastLoginAt:''}]);saveActiveSchool('TEST')}
let auth:ReturnType<typeof useAuth>;
let progress:ReturnType<typeof useProgress>;
function CaptureAuth(){auth=useAuth();return null}
function CaptureProgress(){progress=useProgress();return null}
function deferred<T>(){let resolve!:(value:T)=>void;const promise=new Promise<T>(r=>{resolve=r});return {promise,resolve}}
async function mountAuth(withProgress=false){await seed();render(<AuthProvider><CaptureAuth/>{withProgress&&<ProgressProvider><CaptureProgress/></ProgressProvider>}</AuthProvider>);await waitFor(()=>expect(auth.ready).toBe(true))}
it('self-registration creates accounts but cannot edit an existing profile or PIN',async()=>{
 await seed();storage.saveSchools(storage.loadSchools().map(s=>({...s,allowSelfRegistration:true})));render(<AuthProvider><CaptureAuth/></AuthProvider>);await waitFor(()=>expect(auth.ready).toBe(true));
 const before=storage.loadStudents();const draft={displayName:'Changed name',gradeLevel:'elem_lower' as const,isHighSchoolFoundations:false,avatarId:'mango',pin:'1234'};
 await act(async()=>{await expect(auth.saveStudent(draft,'mark')).rejects.toThrow()});expect(storage.loadStudents()).toEqual(before);
 await act(async()=>{await auth.saveStudent({...draft,displayName:'New student'})});expect(auth.students).toHaveLength(3);
});
it.each(['school','logout'] as const)('rejects pending teacher authentication after %s change',async change=>{
 await mountAuth();const pending=deferred<boolean>();vi.spyOn(pins,'verifyPin').mockReturnValueOnce(pending.promise);let login!:Promise<boolean>;
 act(()=>{login=auth.loginTeacher('0000')});act(()=>{if(change==='school')auth.setSchoolCode('OTHER');else auth.logoutTeacher()});
 await act(async()=>{pending.resolve(true);expect(await login).toBe(false)});expect(auth.isTeacherMode).toBe(false);
});
it.each(['school','logout'] as const)('rejects pending student authentication after %s change without persistence',async change=>{
 await mountAuth();const before=storage.loadStudents();const pending=deferred<boolean>();vi.spyOn(pins,'verifyPin').mockReturnValueOnce(pending.promise);let login!:Promise<boolean>;
 act(()=>{login=auth.loginStudent('mark','0000')});act(()=>{if(change==='school')auth.switchSchool();else auth.logoutStudent()});
 await act(async()=>{pending.resolve(true);expect(await login).toBe(false)});expect(auth.activeStudent).toBeNull();expect(storage.loadStudents()).toEqual(before);expect(storage.loadRememberedStudents()).toEqual([]);
});
it.each(['logout','student change'] as const)('does not expose delayed IndexedDB recovery after %s',async change=>{
 await mountAuth(true);const pending=deferred<BrownoutSnapshot|undefined>();const original=storage.idbGet;vi.spyOn(storage,'idbGet').mockImplementation((store,id)=>store==='brownout_store'?pending.promise as never:original(store,id));
 await act(async()=>{await auth.loginStudent('mark','0000')});act(()=>{if(change==='logout')auth.logoutStudent();else auth.setSchoolCode('OTHER')});
 if(change==='student change')await act(async()=>{await auth.loginStudent('other','0000')});
 await act(async()=>{pending.resolve({studentId:'mark',stage:'studio',moduleKey:'typing',lessonId:'drill',charIndex:3,wpm:0,timestamp:Date.now()})});expect(progress.recovery).toBeNull();
});
it('offers IndexedDB-only recovery on login',async()=>{
 await mountAuth(true);await storage.idbPut('brownout_store','mark',{studentId:'mark',stage:'studio',moduleKey:'typing',lessonId:'drill',charIndex:7,wpm:0,timestamp:Date.now()});
 await act(async()=>{await auth.loginStudent('mark','0000')});await waitFor(()=>expect(progress.recovery?.charIndex).toBe(7));
});
const completionCases=[
 {name:'lesson',complete:()=>progress.markLessonComplete('lesson',50),check:()=>expect(progress.progress.completedLessons).toContain('lesson')},
 {name:'drill',complete:()=>progress.completeDrill('drill',96,30,1),check:()=>expect(progress.progress.typingProgress.completedDrills.drill).toMatchObject({accuracy:96,wpm:30,starsEarned:3})},
 {name:'game',complete:()=>progress.recordGameResult({gameId:'mango_catcher',studentId:'mark',timestamp:new Date().toISOString(),score:100,starsAwarded:2,isNewPersonalBest:true}),check:()=>expect(progress.progress.gameScores.mangoCatcher).toMatchObject({highScore:100,roundsCompleted:1})}
];
it.each(completionCases)('does not resurrect delayed IndexedDB recovery after $name completion',async({complete,check})=>{
 await storage.saveProgressSnapshot(storage.createEmptyProgress('mark'));await storage.flushOfflineMutationQueue();
 await mountAuth(true);const pending=deferred<BrownoutSnapshot|undefined>();const original=storage.idbGet;vi.spyOn(storage,'idbGet').mockImplementation((store,id)=>store==='brownout_store'&&id==='mark'?pending.promise as never:original(store,id));
 await act(async()=>{await auth.loginStudent('mark','0000')});act(complete);check();
 await act(async()=>{pending.resolve({studentId:'mark',stage:'studio',moduleKey:'typing',lessonId:'drill',charIndex:7,wpm:0,timestamp:Date.now()})});
 check();expect(progress.recovery).toBeNull();expect(progress.resumeSnapshot).toBeNull();
});
it.each(completionCases.flatMap(test=>['offered','resumed'].map(state=>({...test,state}))))('clears $state recovery on $name completion',async({complete,check,state})=>{
 await storage.saveProgressSnapshot(storage.createEmptyProgress('mark'));await storage.flushOfflineMutationQueue();
 await mountAuth(true);const snapshot:BrownoutSnapshot={studentId:'mark',stage:'studio',moduleKey:'typing',lessonId:'drill',charIndex:7,wpm:0,timestamp:Date.now()};
 await storage.idbPut('brownout_store','mark',snapshot);await act(async()=>{await auth.loginStudent('mark','0000')});await waitFor(()=>expect(progress.recovery).toEqual(snapshot));
 if(state==='resumed'){act(()=>{progress.resumeRecovery()});expect(progress.resumeSnapshot).toEqual(snapshot)}
 act(complete);check();expect(progress.recovery).toBeNull();expect(progress.resumeSnapshot).toBeNull();
});
function Probe(){const a=useAuth();const s=useStageTheme();return <><output>{a.activeStudent?.displayName??'Logged out'}:{s.stage}:{s.track}</output><button onClick={()=>void a.loginStudent('mark','0000')}>Login</button><button onClick={()=>void a.loginStudent('other','0000')}>Cross school</button><button onClick={a.logoutStudent}>Logout</button><button onClick={s.toggleFoundations}>Toggle</button></>}
it('isolates schools and changes foundational content without changing the studio shell',async()=>{await seed();render(<AuthProvider><StageThemeProvider><Probe/></StageThemeProvider></AuthProvider>);fireEvent.click(screen.getByText('Cross school'));expect(screen.getByRole('status').textContent).toContain('Logged out');fireEvent.click(screen.getByText('Login'));await waitFor(()=>expect(screen.getByRole('status').textContent).toBe('Mark Santos:studio:track_4a'));fireEvent.keyDown(window,{key:'f',altKey:true});expect(screen.getByRole('status').textContent).toBe('Mark Santos:studio:track_4b');expect(document.documentElement.dataset.stage).toBe('studio');fireEvent.click(screen.getByText('Logout'));expect(screen.getByRole('status').textContent).toContain('Logged out')});
it('logs out after 30 minutes without pointer or keyboard activity',async()=>{await seed();render(<AuthProvider><StageThemeProvider><Probe/></StageThemeProvider></AuthProvider>);fireEvent.click(screen.getByText('Login'));await waitFor(()=>expect(screen.getByRole('status').textContent).toContain('Mark Santos'));vi.useFakeTimers({toFake:['Date']});vi.setSystemTime(Date.now()+1800001);await waitFor(()=>expect(screen.getByRole('status').textContent).toContain('Logged out'),{timeout:2000});vi.useRealTimers()});
