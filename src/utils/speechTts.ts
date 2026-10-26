export interface SpeechOptions {rate?:number;stage?:string;onWord?:(index:number)=>void;onEnd?:()=>void;onFallback?:(text:string)=>void}
let speechEnabled=true;let slow=false;let active:SpeechSynthesisUtterance|null=null;
export function configureSpeech(enabled:boolean,slowSpeech:boolean):void {speechEnabled=enabled;slow=slowSpeech}
export function tokenizeWords(text:string):string[] {return text.match(/\S+/g)??[]}
export function stopSpeech():void {if(typeof window!=='undefined'&&window.speechSynthesis)window.speechSynthesis.cancel();active=null}
export function speakText(text:string,options:SpeechOptions={}):boolean {
 stopSpeech();
 if(!speechEnabled||!window.speechSynthesis||typeof SpeechSynthesisUtterance==='undefined'){options.onFallback?.(text);options.onWord?.(-1);options.onEnd?.();return false}
 const u=new SpeechSynthesisUtterance(text);active=u;
 const voices=window.speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang==='en-PH')??voices.find(v=>v.lang==='en-US')??voices.find(v=>v.lang.startsWith('en'))??null;
 u.lang=u.voice?.lang??'en-US';u.pitch=1.05;u.rate=slow?.7:options.rate??(['playful','guided'].includes(options.stage??'')?.85:1);
 const starts=Array.from(text.matchAll(/\S+/g),m=>m.index??0);
 // Native boundary support cannot be known before an event: start in plain-text mode.
 u.onstart=()=>{if(active!==u)return;options.onWord?.(-1);options.onFallback?.(text)};
 u.onboundary=e=>{if(active!==u||e.name!=='word')return;let index=0;for(let i=0;i<starts.length;i++){if(starts[i]<=e.charIndex)index=i;else break}options.onWord?.(index)};
 const end=()=>{if(active!==u)return;active=null;options.onWord?.(-1);options.onEnd?.()};
 u.onend=end;u.onerror=()=>{options.onFallback?.(text);end()};
 window.speechSynthesis.speak(u);return true;
}
