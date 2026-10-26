import {useEffect,useRef} from 'react';
import {sentenceScrambleBank} from '../../data/gameData';
import type {ScrambleItem} from '../../types/games';
import {useStageTheme} from '../../context/StageThemeContext';
import {SentenceBuilder} from '../english/SentenceBuilder';
import {useGameSession} from './GamesModule';
import {speakText} from '../../utils/speechTts';
export function SentenceScramble({puzzles=sentenceScrambleBank}:{puzzles?:ScrambleItem[]}){const {stage,track}=useStageTheme();const level=stage==='studio'?'track_4b':track;const bank=puzzles.filter(p=>p.level===level||stage==='studio'&&p.level==='track_4a');const game=useGameSession('sentence_scramble',{done:false,index:0,score:0,ids:[] as string[],selection:[] as number[]});const {state,update,finish,blocked}=game;const puzzle=bank[state.index];const latest=useRef({puzzle,blocked});latest.current={puzzle,blocked};useEffect(()=>{const timer=setTimeout(()=>{if(latest.current.puzzle&&!latest.current.blocked)speakText(latest.current.puzzle.correctSentence.split(' ').slice(0,2).join(' '))},12000);return()=>clearTimeout(timer)},[puzzle?.id]);
 if(state.done)return <section className={`game-arena ${stage==='studio'?'studio':''}`} data-stage={stage}><h2>Sentence Scramble</h2><p>Puzzles complete. Your score is saved.</p></section>;
 if(!puzzle)return <p>No sentence puzzles are available.</p>;
 // Punctuation in the source bank is inconsistent on a few tiles; the sentence is authoritative.
 const targets=puzzle.correctSentence.split(/\s+/);const remaining=[...puzzle.scrambledWords];for(const target of targets){const i=remaining.findIndex(w=>w.replace(/[.?!,]/g,'')===target.replace(/[.?!,]/g,''));if(i>=0)remaining.splice(i,1)}
 const complete=()=>{if(blocked||state.done)return;const next={...state,index:state.index+1,score:state.score+100,ids:[...state.ids,puzzle.id],selection:[]};if(next.index>=bank.length)finish(next,next.score,next.ids);else update(next)};
 return <section className={`game-arena ${stage==='studio'?'studio':''} stack`} data-stage={stage}><h2>Sentence Scramble</h2><p>Score: {state.score} · Puzzle {Math.min(state.index+1,bank.length)}/{bank.length}</p>{state.done?<p>Puzzles complete. Your score is saved.</p>:<fieldset disabled={blocked} style={{border:0,padding:0}}><SentenceBuilder key={`${puzzle.id}:${game.recoveryKey}`} exercise={{id:puzzle.id,level:puzzle.level,grammarSkill:puzzle.grammarFocus,promptInstruction:'Put the words in order. Use Tab and Enter or tap a tile.',targetTiles:targets,distractorTiles:remaining,targetSentence:puzzle.correctSentence,contextHint:{visualDescription:'The first word starts with a capital letter. Look for the final punctuation.'}}} initialSelection={state.selection} onChange={selection=>update({...state,selection})} onComplete={complete}/></fieldset>}</section>
}
export default SentenceScramble;
