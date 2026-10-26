import {useMemo,useRef,useState} from 'react';
import type {SentenceExercise} from '../../types/curriculum';
import {speakText,stopSpeech} from '../../utils/speechTts';
import {useEffect} from 'react';
export interface SentenceBuilderProps {exercise:SentenceExercise;onComplete?:()=>void;initialSelection?:number[];onChange?:(selection:number[])=>void}
export function SentenceBuilder({exercise,onComplete,initialSelection=[],onChange}:SentenceBuilderProps){
 const tiles=useMemo(()=>[...exercise.targetTiles,...exercise.distractorTiles].map((word,id)=>({word,id})).reverse(),[exercise]);
 const [selected,setSelected]=useState<number[]>(initialSelection);const [feedback,setFeedback]=useState('');const completed=useRef(false);
 useEffect(()=>()=>stopSpeech(),[]);
 const change=(next:number[])=>{if(completed.current)return;setSelected(next);setFeedback('');onChange?.(next)};
 const check=()=>{if(completed.current)return;const words=selected.map(id=>tiles.find(t=>t.id===id)?.word);if(words.length===exercise.targetTiles.length&&words.every((w,i)=>w===exercise.targetTiles[i])){completed.current=true;setFeedback('Correct. Sentence complete.');onComplete?.()}else setFeedback('Try again. Check the word order.')};
 return <section className="card stack" aria-label="Sentence builder"><h2>{exercise.grammarSkill}</h2><p>{exercise.promptInstruction}</p><p>{exercise.contextHint.visualDescription}</p><div className="actions"><button onClick={()=>speakText(exercise.targetSentence)}>Listen</button><button onClick={()=>speakText(exercise.targetTiles.slice(0,2).join(' '))}>Hint</button></div><div className="tile-rack" aria-label="Your sentence" style={{minHeight:64}}>{selected.map((id,i)=><button key={id} className="word-tile" aria-label={`Remove ${tiles.find(t=>t.id===id)?.word} at ${i+1}`} onClick={()=>change(selected.filter(x=>x!==id))}>{tiles.find(t=>t.id===id)?.word}</button>)}</div><div className="tile-pool">{tiles.map(t=><button className="word-tile" key={t.id} disabled={selected.includes(t.id)||completed.current} onClick={()=>{speakText(t.word);change([...selected,t.id])}}>{t.word}</button>)}</div><div className="actions"><button onClick={()=>change(selected.slice(0,-1))}>Undo</button><button onClick={()=>change([])}>Reset</button><button onClick={check}>Check sentence</button></div><p role="status">{feedback}</p></section>
}
export default SentenceBuilder;
