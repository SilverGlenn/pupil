import {useEffect,useRef,useState} from 'react';
import type {GameId} from '../../types/games';
import {useProgress} from '../../context/ProgressContext';
import {useStageTheme} from '../../context/StageThemeContext';
import {stopSpeech} from '../../utils/speechTts';
import {JeepneyWordExpress} from './JeepneyWordExpress';
import {FallingKeysGame} from './FallingKeysGame';
import {SentenceScramble} from './SentenceScramble';
import {TechDetectiveGame} from './TechDetectiveGame';
/** Event-owned writes avoid context-function dependency loops and duplicate result effects. */
export function useGameSession<T extends {done:boolean}>(game:GameId,initial:T){const p=useProgress();const {stage}=useStageTheme();const latest=useRef(p);latest.current=p;const [state,setState]=useState(initial);const current=useRef(state);current.current=state;const recorded=useRef(false);const resumed=useRef('');
 const update=(next:T)=>{if(current.current.done&&!next.done)recorded.current=false;current.current=next;setState(next);if(!next.done&&!latest.current.recovery&&!latest.current.resumeSnapshot)latest.current.saveSnapshot({stage,moduleKey:'games',lessonId:game,charIndex:0,wpm:0,state:{game,session:next}})};
 useEffect(()=>{const s=p.resumeSnapshot;if(s?.moduleKey!=='games'||s.lessonId!==game||!s.state?.session||resumed.current===String(s.timestamp))return;resumed.current=String(s.timestamp);const restored=s.state.session as T;current.current=restored;setState(restored);recorded.current=restored.done;latest.current.clearResume()},[p.resumeSnapshot,game]);
 useEffect(()=>()=>stopSpeech(),[]);
 const finish=(next:T,score:number,completedIds:string[]=[],streakAchieved=0,starsAwarded=3)=>{if(recorded.current||latest.current.recovery||latest.current.resumeSnapshot)return;recorded.current=true;update({...next,done:true});latest.current.recordGameResult({gameId:game,studentId:latest.current.progress.studentId,timestamp:new Date().toISOString(),score,starsAwarded,completedIds,streakAchieved,isNewPersonalBest:false})};
 return {state,current,update,finish,blocked:!!p.recovery||!!p.resumeSnapshot,stage,recoveryKey:resumed.current};
}
export function GamesModule(){const p=useProgress();const {stage}=useStageTheme();const [game,setGame]=useState<GameId|null>(null);useEffect(()=>{const s=p.resumeSnapshot;if(s?.moduleKey==='games'&&['jeepney_word_express','mango_catcher','sentence_scramble','tech_detective'].includes(s.lessonId))setGame(s.lessonId as GameId)},[p.resumeSnapshot]);const games:[GameId,string][]=[['jeepney_word_express',stage==='studio'?'Transit word express':'Jeepney Word Express'],['mango_catcher',stage==='studio'?'Key capsules':'Mango Catcher'],['sentence_scramble','Sentence Scramble'],['tech_detective','Tech Detective']];return <section className="module-page stack" data-stage={stage}><h1>{stage==='studio'?'Practice studio':'Learning games'}</h1><nav className="tabs">{games.map(([id,label])=><button key={id} aria-pressed={game===id} onClick={()=>setGame(id)}>{label}</button>)}</nav>{game==='jeepney_word_express'&&<JeepneyWordExpress/>}{game==='mango_catcher'&&<FallingKeysGame/>}{game==='sentence_scramble'&&<SentenceScramble/>}{game==='tech_detective'&&<TechDetectiveGame/>}{!game&&<p>Choose a game to begin.</p>}</section>}
export default GamesModule;
