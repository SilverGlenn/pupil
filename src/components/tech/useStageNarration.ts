import {useEffect,useRef,useState} from 'react';
import {speakText,stopSpeech,type SpeechOptions} from '../../utils/speechTts';

// Retain an observed gesture across lesson → quiz mounts on browsers without UserActivation.
let activatedInThisDocument=false;
/** Stage 1 guidance starts only after browser/user activation, never a fabricated audio timer. */
export function useStageNarration(text:string,stage:string,enabled=true,options:SpeechOptions={}){
 const callbacks=useRef(options);callbacks.current=options;
 const latest=useRef({text,stage,enabled});latest.current={text,stage,enabled};
 const [activated,setActivated]=useState(()=>activatedInThisDocument||Boolean(navigator.userActivation?.hasBeenActive));
 const spoken=useRef('');
 function replay(){const current=latest.current;if(!current.enabled||!current.text)return;spoken.current=current.text;callbacks.current.onWord?.(-1);speakText(current.text,{...callbacks.current,stage:current.stage})}
 useEffect(()=>{
  if(stage!=='playful'||!enabled)return;
  function unlock(event:Event){if(event instanceof KeyboardEvent&&event.repeat)return;activatedInThisDocument=true;setActivated(true);replay();window.removeEventListener('pointerdown',unlock,true);window.removeEventListener('keydown',unlock,true)}
  if(!activated){window.addEventListener('pointerdown',unlock,true);window.addEventListener('keydown',unlock,true)}
  return()=>{window.removeEventListener('pointerdown',unlock,true);window.removeEventListener('keydown',unlock,true)};
 },[stage,enabled,activated]);
 useEffect(()=>{if(!text||!enabled)spoken.current='';if(stage==='playful'&&enabled&&activated&&text&&spoken.current!==text)replay();if(!enabled)stopSpeech()},[text,stage,enabled,activated]);
 useEffect(()=>()=>stopSpeech(),[]);
 return replay;
}
