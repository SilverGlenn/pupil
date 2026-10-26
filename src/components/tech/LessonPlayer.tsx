import {useEffect,useRef,useState} from 'react';
import type {Lesson} from '../../types/curriculum';
import {useStageTheme} from '../../context/StageThemeContext';
import {useProgress} from '../../context/ProgressContext';
import {speakText,stopSpeech,tokenizeWords} from '../../utils/speechTts';
import {QuizEngine} from './QuizEngine';
import {LessonArt} from './LessonArt';
import {NarrationButton} from './NarrationButton';
import {useStageNarration} from './useStageNarration';
import {useSettings} from '../../context/SettingsContext';
export interface LessonPlayerProps {lesson:Lesson;onComplete?:()=>void;onBack?:()=>void}
export function LessonPlayer({lesson,onComplete,onBack}:LessonPlayerProps){
 const {stage}=useStageTheme();const progress=useProgress();const api=useRef(progress);api.current=progress;
 const restored=progress.resumeSnapshot?.moduleKey==='tech'&&progress.resumeSnapshot.lessonId===lesson.lessonId?progress.resumeSnapshot:null;
 const [index,setIndex]=useState(()=>Math.min(lesson.slides.length-1,Math.max(0,restored?.slideIndex??0)));const [quiz,setQuiz]=useState(false);const [word,setWord]=useState(-1);const [fallback,setFallback]=useState(false);const [complete,setComplete]=useState(false);
 // The state initializer has captured this lesson's restored slide before consuming the offer.
 useEffect(()=>{if(restored)api.current.clearResume()},[restored]);
 const slide=lesson.slides[index];const {settings}=useSettings();
 useEffect(()=>{stopSpeech();setWord(-1);setFallback(false);if(slide&&!complete)api.current.saveSnapshot({stage,moduleKey:'tech',lessonId:lesson.lessonId,slideIndex:index,charIndex:0,wpm:0});return()=>stopSpeech()},[index,lesson.lessonId,stage,slide,complete]);
 const listen=useStageNarration(!quiz&&!complete?(slide?.bodyText??''):'',stage,settings.speechEnabled,{onWord:setWord,onFallback:()=>setFallback(true),onEnd:()=>setWord(-1)});
 if(!slide)return <p>No slides available.</p>;
 return <article className="module-page stack"><header className="module-header"><div><p className="eyebrow">{lesson.moduleTitle}</p><h1>{lesson.title}</h1></div>{onBack&&<button onClick={()=>{stopSpeech();onBack()}}>Back to lessons</button>}</header>{!quiz?<><p>Slide {index+1} / {lesson.slides.length}</p><section className="card stack"><h2>{slide.headline}</h2><LessonArt slide={slide} studio={stage==='studio'}/><p className="reading-prompt">{tokenizeWords(slide.bodyText).map((token,i)=><span key={i}><span className={`word-token${word===i?' active-reading':''}`}>{token}</span>{i<tokenizeWords(slide.bodyText).length-1?' ':''}</span>)}</p><NarrationButton onClick={listen} label="Replay slide narration" playful={stage==='playful'}/>{fallback&&<p className="muted">Follow the text above. Word highlighting is available when your device supplies speech boundaries.</p>}</section><div className="actions"><button disabled={index===0} onClick={()=>setIndex(index-1)}>Previous slide</button>{index<lesson.slides.length-1?<button className="primary" onClick={()=>setIndex(index+1)}>Next slide</button>:<button className="primary" onClick={()=>{stopSpeech();setQuiz(true)}}>Knowledge check</button>}</div></>:<><button onClick={()=>setQuiz(false)}>Review slides</button><QuizEngine stage={stage} speechEnabled={settings.speechEnabled} questions={lesson.quiz} onComplete={()=>{if(complete)return;setComplete(true);api.current.markLessonComplete(lesson.lessonId);onComplete?.()}}/></>}{lesson.realLifeTip&&<aside className="panel"><h3>Real-life tip</h3><p>{lesson.realLifeTip}</p></aside>}{lesson.voiceoverScript&&<details className="panel"><summary>Full original voiceover</summary><p>{lesson.voiceoverScript}</p><button onClick={()=>{setWord(-1);speakText(lesson.voiceoverScript!,{stage})}}>Listen to full voiceover</button></details>}{complete&&<p role="status">Lesson complete.</p>}</article>
}
export default LessonPlayer;
