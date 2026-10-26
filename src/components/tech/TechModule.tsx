import {useEffect,useState} from 'react';
import {techLessons} from '../../data/techLessons';
import {useStageTheme} from '../../context/StageThemeContext';
import {useProgress} from '../../context/ProgressContext';
import {LessonPlayer} from './LessonPlayer';
export function TechModule(){
 const {track}=useStageTheme();const {progress,resumeSnapshot,clearResume}=useProgress();const [selected,setSelected]=useState<string|null>(null);
 const level=track==='level_1'?'preschool':track==='level_2'?'elem_lower':track==='level_3'?'elem_upper':'highschool';
 const lessons=techLessons.filter(lesson=>lesson.level===level&&(level!=='highschool'||Boolean(lesson.isFoundationBridge)===(track==='track_4a')));
 useEffect(()=>{setSelected(null)},[track]);
 useEffect(()=>{if(resumeSnapshot?.moduleKey==='tech')setSelected(resumeSnapshot.lessonId)},[resumeSnapshot]);
 const active=lessons.find(lesson=>lesson.lessonId===selected);
 if(active)return <LessonPlayer key={active.lessonId} lesson={active} onBack={()=>{clearResume();setSelected(null)}}/>;
 const groups=Array.from(new Set(lessons.map(lesson=>lesson.moduleId)));
 return <section className="module-page stack"><header className="module-header"><div><p className="eyebrow">{track==='track_4a'?'Foundations Bridge':track==='track_4b'?'Studio Standard':'Computer lab'}</p><h1>Tech Literacy</h1><p>Read, listen, and check your knowledge.</p></div></header>{groups.map(moduleId=>{const entries=lessons.filter(lesson=>lesson.moduleId===moduleId);return <section className="panel stack" key={moduleId}><h2>{entries[0].moduleTitle}</h2><div className="card-grid">{entries.map(lesson=><article className="card stack" key={lesson.lessonId}><h3>{lesson.title}</h3><p>{lesson.summary}</p><p>{progress.completedLessons.includes(lesson.lessonId)?'Completed':'Ready to learn'}</p><button aria-label={`Open lesson: ${lesson.title}`} onClick={()=>{clearResume();setSelected(lesson.lessonId)}}>Open lesson</button></article>)}</div></section>})}{lessons.length===0&&<p>No lessons are available for this course.</p>}</section>
}
export default TechModule;
