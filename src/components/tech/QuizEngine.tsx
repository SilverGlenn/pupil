import {useState} from 'react';
import type {QuizQuestion} from '../../types/curriculum';
import {speakText,stopSpeech} from '../../utils/speechTts';
import {useEffect} from 'react';
import {playChime,playWoodenTap} from '../../utils/audioSynth';
import {useStageNarration} from './useStageNarration';
import {NarrationButton} from './NarrationButton';
export interface QuizEngineProps {questions:QuizQuestion[];onComplete?:()=>void;stage?:string;speechEnabled?:boolean}
export function QuizEngine({questions,onComplete,stage='guided',speechEnabled=true}:QuizEngineProps){
 const [index,setIndex]=useState(0);const [choice,setChoice]=useState<number|null>(null);const [finished,setFinished]=useState(false);
 useEffect(()=>()=>stopSpeech(),[]);
 const question=questions[index];
 const replay=useStageNarration(question&&!finished?`${question.ttsAudioText} ${question.options.join('. ')}`:'',stage,speechEnabled);
 if(!question)return <p>No knowledge check is available.</p>;
 const correct=choice===question.correctIndex;
 function answer(value:number){if(correct||finished)return;setChoice(value);if(value===question.correctIndex)playChime();else playWoodenTap();if(stage==='playful'&&speechEnabled)speakText(question.optionFeedback?.[value]??(value===question.correctIndex?question.explanation:question.incorrectExplanation??question.explanation),{stage})}
 return <section className="card stack" aria-label="Knowledge check"><h2>Knowledge check {index+1} / {questions.length}</h2><p>{question.questionText}</p><NarrationButton label="Replay question and answers" onClick={replay} playful={stage==='playful'}/><div className="quiz-options">{question.options.map((option,i)=><button key={i} disabled={correct||finished} aria-pressed={choice===i} onClick={()=>answer(i)}>{option}</button>)}</div><p role="status">{choice!==null?(question.optionFeedback?.[choice]??(correct?question.explanation:question.incorrectExplanation??question.explanation)):''}</p>{correct&&!finished&&<button className="primary" onClick={()=>{if(index===questions.length-1){setFinished(true);onComplete?.()}else{setIndex(index+1);setChoice(null);stopSpeech()}}}>{index===questions.length-1?'Finish quiz':'Next question'}</button>}{finished&&<p>Knowledge check complete.</p>}</section>
}
export default QuizEngine;
