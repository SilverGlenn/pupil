import {useEffect,useRef,useState} from 'react';
import type {SimulatorProps} from '../../types/simulators';
import {useStageTheme} from '../../context/StageThemeContext';
import {useSettings} from '../../context/SettingsContext';
import {useProgress} from '../../context/ProgressContext';
import {playChime} from '../../utils/audioSynth';
import {speakText,stopSpeech} from '../../utils/speechTts';
import {useStageNarration} from '../tech/useStageNarration';
import {NarrationButton} from '../tech/NarrationButton';

type Phase='moving'|'success'|'warning'|'complete';
export function ScreenTapTrainer({onComplete}:SimulatorProps={}){
 const {stage}=useStageTheme();const {settings}=useSettings();const {markLessonComplete}=useProgress();
 const [count,setCount]=useState(0);const [phase,setPhase]=useState<Phase>('moving');const [message,setMessage]=useState('');const [holding,setHolding]=useState(false);const [feedbackSpeaking,setFeedbackSpeaking]=useState(false);
 const [guidanceEnabled,setGuidanceEnabled]=useState(settings.speechEnabled);
 const [reduced,setReduced]=useState(()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false);
 const state=useRef<Phase>('moving');const score=useRef(0);const awarded=useRef(false);
 const start=useRef<{id:number;t:number;x:number;y:number;invalid:boolean}|null>(null);
 const taps=useRef<number[]>([]);const transition=useRef<ReturnType<typeof setTimeout>>();const lastPointer=useRef(-Infinity);
 const completion=useRef({markLessonComplete,onComplete});completion.current={markLessonComplete,onComplete};
 const prompt=stage==='studio'?'Practice a controlled tap on each target.':count===0?'Let us practice gentle tapping! Look for the yellow butterfly and tap it softly with one finger.':`Gently tap the ${['yellow butterfly','blue fish','blue dragonfly','ripe yellow mango','yellow butterfly'][Math.min(count,4)]}.`;
 // Cancellation does not call the locked speech utility's guarded onEnd callback.
 // Release our sequencing gate explicitly on mute or leaving pre-reader guidance.
 // A following render also lets SettingsProvider finish configuring the native utility
 // before guidance resumes. Child passive effects otherwise run before that configuration.
 useEffect(()=>{setGuidanceEnabled(settings.speechEnabled);if(!settings.speechEnabled||stage!=='playful'){stopSpeech();setFeedbackSpeaking(false)}},[settings.speechEnabled,stage]);
 const replay=useStageNarration(phase==='moving'&&!feedbackSpeaking?prompt:'',stage,settings.speechEnabled&&guidanceEnabled);
 useEffect(()=>{const media=window.matchMedia?.('(prefers-reduced-motion: reduce)');if(!media)return;const changed=()=>setReduced(media.matches);media.addEventListener?.('change',changed);return()=>media.removeEventListener?.('change',changed)},[]);
 useEffect(()=>()=>{clearTimeout(transition.current);stopSpeech()},[]);
 function enter(next:Phase){state.current=next;setPhase(next)}
 function announce(text:string){setMessage(text);if(stage==='playful'&&settings.speechEnabled){setFeedbackSpeaking(true);speakText(text,{stage,onEnd:()=>setFeedbackSpeaking(false)})}}
 function warning(){if(state.current==='complete')return;clearTimeout(transition.current);enter('warning');setHolding(false);start.current=null;announce(stage==='studio'?'Use one controlled, gentle tap.':'Take a breath, friend! Just one gentle tap with one finger.');transition.current=setTimeout(()=>{enter(score.current===5?'complete':'moving');if(score.current===5)finish()},2000)}
 function finish(){if(awarded.current)return;awarded.current=true;completion.current.markLessonComplete('sim-tap');completion.current.onComplete?.()}
 function trackAttempt(){const now=Date.now();taps.current=taps.current.filter(t=>now-t<1000);taps.current.push(now);if(taps.current.length>=5){warning();return false}return state.current==='moving'}
 function success(){if(state.current!=='moving'||awarded.current)return;enter('success');setHolding(false);score.current++;setCount(score.current);playChime();announce(stage==='studio'?'Target registered.':'Gentle touch! Wonderful job!');clearTimeout(transition.current);transition.current=setTimeout(()=>{if(score.current===5){enter('complete');finish()}else enter('moving')},600)}
 const shown=phase==='success'?count-1:Math.min(count,4);const kind=['butterfly','fish','dragonfly','mango','butterfly'][shown];
 return <section className="card stack c-tap"><style>{`@keyframes pupil-tap-flight{0%,100%{transform:translate(-50%,0)}50%{transform:translate(calc(-50% + 24px),18px)}}@keyframes pupil-tap-twirl{to{transform:rotate(360deg)}}@keyframes pupil-tap-ripple{from{opacity:1;transform:scale(.4)}to{opacity:0;transform:scale(1.5)}}.c-tap .c-tap-target{animation:pupil-tap-flight 4s ease-in-out infinite}.c-tap .c-tap-hit{animation:pupil-tap-twirl .6s ease-out}.c-tap .c-tap-ripple{transform-origin:center;animation:pupil-tap-ripple .6s ease-out}@media(prefers-reduced-motion:reduce){.c-tap .c-tap-target,.c-tap .c-tap-hit,.c-tap .c-tap-ripple{animation:none!important}}`}</style><h2>Screen Tap &amp; Gentle Target Trainer</h2><p>{prompt}</p><NarrationButton label="Replay tap instruction" onClick={()=>{if(phase==='moving')replay();else if(message)announce(message)}} playful={stage==='playful'}/><p>{count} / 5 {stage==='studio'?'targets':'stars'}</p><p aria-label="Tap practice state">{phase==='moving'?(reduced?'Ready — reduced motion':'Moving target'):phase==='success'?'Success — gentle tap':phase==='warning'?'Motion paused — one gentle tap':'Complete'}</p>
 <div className="simulator-scene" onPointerDownCapture={()=>trackAttempt()} style={{position:'relative',aspectRatio:'16 / 9',minHeight:300,overflow:'hidden',background:stage==='studio'?'#0f172a':phase==='warning'?'#ede9fe':'#d1fae5',borderRadius:24}}>
 <svg aria-hidden="true" viewBox="0 0 640 360" style={{position:'absolute',width:'100%',height:'100%'}}>{stage==='studio'?<><path d="M0 90H640M0 180H640M0 270H640M160 0V360M320 0V360M480 0V360" stroke="#334155"/><circle cx="320" cy="180" r="100" stroke="#6366f1" fill="none"/></>:<><circle cx="560" cy="55" r="34" fill="#fbbf24"/><ellipse cx="350" cy="300" rx="270" ry="50" fill="#0284c7"/><path d="M30 360Q100 220 40 20M40 80Q180 0 180 90Q100 130 40 80M45 140Q200 80 190 180Q100 180 45 140" fill="#059669" stroke="#1e293b" strokeWidth="3"/></>}</svg>
 {phase!=='complete'&&<button className="c-tap-target" aria-label={`Tap target ${Math.min(count+1,5)}`} disabled={phase!=='moving'} style={{position:'absolute',left:`${[25,60,40,70,30][shown]}%`,top:`${[15,35,40,10,30][shown]}%`,width:128,height:128,touchAction:'none',borderRadius:'50%',background:stage==='studio'?'#1e293b':'#fef3c7',color:stage==='studio'?'#f8fafc':'#1e293b',transform:'translate(-50%,0)',animation:reduced?'none':undefined,animationPlayState:phase!=='moving'||holding?'paused':'running'}}
 onKeyDown={e=>{if(e.repeat&&(e.key==='Enter'||e.key===' '))e.preventDefault()}}
 onPointerDown={e=>{lastPointer.current=Date.now();if(state.current!=='moving')return;if(start.current||e.isPrimary===false){warning();return}start.current={id:e.pointerId,t:Date.now(),x:e.clientX,y:e.clientY,invalid:false};setHolding(true);e.currentTarget.setPointerCapture?.(e.pointerId)}}
 onPointerMove={e=>{const s=start.current;if(s&&Math.hypot(e.clientX-s.x,e.clientY-s.y)>25)s.invalid=true}}
 onPointerCancel={()=>warning()}
 onPointerUp={e=>{lastPointer.current=Date.now();if(state.current!=='moving')return;const s=start.current;start.current=null;setHolding(false);if(!s||s.id!==e.pointerId||s.invalid||Date.now()-s.t>650||Math.hypot(e.clientX-s.x,e.clientY-s.y)>25){warning();return}success()}}
 onClick={e=>{if(e.detail===0&&Date.now()-lastPointer.current>100&&trackAttempt())success()}}>
 <svg viewBox="0 0 100 100" aria-hidden="true" width="90" height="90" style={{overflow:'visible'}}>{phase==='success'&&<g className={reduced?'':'c-tap-ripple'}><circle cx="50" cy="50" r="48" stroke="#0284c7" fill="none" strokeWidth="3"/>{[0,60,120,180,240,300].map(angle=><path key={angle} d="M50 -10l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" transform={`rotate(${angle} 50 50)`} fill="#fbbf24" stroke="#1e293b"/>)}</g>}<g className={phase==='success'&&!reduced?'c-tap-hit':undefined} style={{transformOrigin:'50px 50px'}}>{stage==='studio'?<><circle cx="50" cy="50" r="32" fill="none" stroke="#818cf8" strokeWidth="4"/><path d="M50 10V90M10 50H90" stroke="#e2e8f0" strokeWidth="3"/></>:kind==='fish'?<><ellipse cx="45" cy="50" rx="30" ry="20" fill="#38bdf8" stroke="#1e293b" strokeWidth="3"/><path d="M70 50L95 30V70Z" fill="#0284c7" stroke="#1e293b" strokeWidth="3"/><circle cx="30" cy="45" r="4"/></>:kind==='mango'?<><path d="M60 15Q110 45 50 87Q10 85 20 50Q25 20 60 15" fill="#fbbf24" stroke="#1e293b" strokeWidth="3"/><path d="M60 15Q75 0 90 15Q75 30 60 15" fill="#059669"/></>:<><ellipse cx="32" cy="35" rx={kind==='dragonfly'?28:23} ry={kind==='dragonfly'?10:20} fill={kind==='dragonfly'?'#38bdf8':'#fbbf24'} stroke="#1e293b" strokeWidth="3"/><ellipse cx="68" cy="35" rx={kind==='dragonfly'?28:23} ry={kind==='dragonfly'?10:20} fill={kind==='dragonfly'?'#38bdf8':'#fbbf24'} stroke="#1e293b" strokeWidth="3"/><ellipse cx="50" cy="53" rx="5" ry="30" fill="#1e293b"/></>}</g></svg></button>}</div><p role="status">{message}</p>{phase==='complete'&&<p>Practice complete.</p>}</section>
}
export default ScreenTapTrainer;
