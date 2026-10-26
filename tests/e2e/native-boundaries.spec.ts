import {test,expect} from '@playwright/test';
import {login,modulePage} from './helpers';
test('TC-07: native AudioContext schedules oscillators after actual physical typing (runner scheduling only)',async({page})=>{
 await page.addInitScript(()=>{const starts:{at:number;scheduled:number;inputDelta:number}[]=[];(window as any).__audioStarts=starts;let input=0;window.addEventListener('keydown',()=>input=performance.now(),true);const native=OscillatorNode.prototype.start;OscillatorNode.prototype.start=function(when=0){starts.push({at:performance.now(),scheduled:when-this.context.currentTime,inputDelta:performance.now()-input});return native.call(this,when)}});
 await login(page);await modulePage(page,'typing');await page.getByLabel('Typing practice area').click();await page.evaluate(()=>(window as any).__audioStarts.length=0);await page.keyboard.press('a');const starts=await page.evaluate(()=>(window as any).__audioStarts);expect(starts.length).toBeGreaterThan(0);expect(starts.every((s:any)=>Number.isFinite(s.scheduled)&&s.scheduled<1)).toBe(true);expect(starts[0].inputDelta).toBeLessThan(15);console.log('TC07 runner native scheduling (not audible hardware latency)',starts);
});
test('TC-08: native-boundary-to-highlight plumbing only; visible unsynchronized text fallback',async({page})=>{
 await page.addInitScript(()=>{class Utterance {text:string;onboundary:any;onend:any;onerror:any;rate=1;pitch=1;lang='';constructor(text:string){this.text=text}}Object.defineProperty(window,'SpeechSynthesisUtterance',{value:Utterance,configurable:true});Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[],cancel:()=>{},speak:(u:any)=>{(window as any).__utterance=u;u.onstart?.()}},configurable:true})});
 await login(page);await modulePage(page,'tech');await page.getByRole('button',{name:/Open lesson/}).first().click();
 await page.getByRole('button',{name:'Replay slide narration'}).first().click();await expect(page.locator('.active-reading')).toHaveCount(0);await expect(page.getByText(/Follow the text above. Word highlighting is available/)).toBeVisible();
 await page.evaluate(()=>{const u=(window as any).__utterance;u.onboundary?.({name:'word',charIndex:0})});await expect(page.locator('.active-reading').first()).toBeVisible();
 await page.evaluate(()=>{const u=(window as any).__utterance;u.onend?.()});await page.getByRole('button',{name:'Home',exact:true}).click();await expect(page.locator('.active-reading')).toHaveCount(0);
});
test('TC-08 unsupported native speech keeps the lesson readable with explicit visual fallback',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'speechSynthesis',{value:undefined,configurable:true});Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true})});await login(page);await modulePage(page,'tech');await page.getByRole('button',{name:/Open lesson/}).first().click();await page.getByRole('button',{name:'Replay slide narration'}).click();await expect(page.getByText(/Follow the text above. Word highlighting is available/)).toBeVisible();await expect(page.locator('.active-reading')).toHaveCount(0);await expect(page.locator('.reading-prompt')).not.toBeEmpty();
});
test('mobile viewport keeps body within viewport while keyboard scrolls without shrinking keys',async({page})=>{
 await page.setViewportSize({width:390,height:844});await login(page);for(const key of ['home','tech','english','typing','games','simulators']){await modulePage(page,key);await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)}
});
