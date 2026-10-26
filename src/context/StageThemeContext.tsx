import {createContext,useContext,useEffect,useCallback,type ReactNode} from 'react';
import {useAuth} from './AuthContext';
import type {InterfaceMode} from '../types/system';
import type {CurriculumTrack} from '../types/curriculum';
const Context=createContext<{stage:InterfaceMode;foundationsMode:boolean;track:CurriculumTrack;toggleFoundations:()=>void}|null>(null);
export function StageThemeProvider({children}:{children:ReactNode}) {
 const {activeStudent,updateStudent}=useAuth();const grade=activeStudent?.gradeLevel;const stage:InterfaceMode=grade==='preschool'?'playful':grade==='elem_upper'?'dashboard':grade==='highschool'?'studio':'guided';const foundationsMode=stage==='studio'&&!!activeStudent?.isHighSchoolFoundations;
 const track:CurriculumTrack=stage==='playful'?'level_1':stage==='guided'?'level_2':stage==='dashboard'?'level_3':foundationsMode?'track_4a':'track_4b';
 const toggleFoundations=useCallback(()=>{if(activeStudent?.gradeLevel==='highschool')updateStudent(activeStudent.studentId,{isHighSchoolFoundations:!activeStudent.isHighSchoolFoundations})},[activeStudent,updateStudent]);
 useEffect(()=>{document.documentElement.dataset.stage=stage},[stage]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.altKey&&e.key.toLowerCase()==='f'&&stage==='studio'){e.preventDefault();toggleFoundations()}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[stage,toggleFoundations]);
 return <Context.Provider value={{stage,foundationsMode,track,toggleFoundations}}>{children}</Context.Provider>
}
export function useStageTheme(){const c=useContext(Context);if(!c)throw new Error('StageThemeProvider is required.');return c}
