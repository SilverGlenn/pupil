let context:AudioContext|null=null;let enabled=true;
export function setAudioEnabled(value:boolean):void {enabled=value}
export function unlockAudio():AudioContext|null {
 if(!enabled)return null;
 try {const Ctor=window.AudioContext??(window as unknown as {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!Ctor)return null;context??=new Ctor({latencyHint:'interactive'});if(context.state==='suspended')void context.resume().catch(()=>{});return context}catch{return null}
}
function tone(frequency:number,duration:number,type:OscillatorType='sine',delay=0):void {
 const ctx=unlockAudio();if(!ctx)return;
 const at=ctx.currentTime+delay;const osc=ctx.createOscillator();const gain=ctx.createGain();
 osc.type=type;osc.frequency.setValueAtTime(frequency,at);gain.gain.setValueAtTime(0.075,at);gain.gain.exponentialRampToValueAtTime(0.001,at+duration);
 osc.connect(gain);gain.connect(ctx.destination);osc.onended=()=>{osc.disconnect();gain.disconnect()};osc.start(at);osc.stop(at+duration);
}
export function playChime():void {tone(523.25,.08);tone(659.25,.08,'sine',.045)}
export function playWoodenTap():void {tone(180,.04,'triangle')}
export function playFanfare():void {tone(523.25,.3,'sine');tone(659.25,.35,'sine',.2);tone(783.99,.4,'sine',.4)}
export function playSiren():void {for(let i=0;i<4;i++)tone(i%2?330:440,.15,'triangle',i*.15)}
if(typeof window!=='undefined') {window.addEventListener('pointerdown',()=>unlockAudio(),{once:true});window.addEventListener('keydown',()=>unlockAudio(),{once:true})}
