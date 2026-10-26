import {describe,it,expect,vi,afterEach} from 'vitest';
import {readFileSync} from 'node:fs';
import * as brownout from '../src/utils/brownoutManager';
import {idbPut,idbGet} from '../src/utils/storageEngine';
import {speakText,stopSpeech} from '../src/utils/speechTts';
import {hashPin,verifyPin,generateSalt} from '../src/utils/cryptoPin';
import {computeAccuracy,computeWpm,computeNetWpm,updateStreak} from '../src/utils/telemetry';
import {saveRememberedCard,loadRememberedStudents,removeRememberedCard,saveProgressSnapshot,loadProgress,flushOfflineMutationQueue,getOfflineMutationQueue} from '../src/utils/storageEngine';
import {recordBrownoutSnapshot,getBrownoutSnapshot,clearSnapshot,flushBrownoutSnapshot} from '../src/utils/brownoutManager';
import type {RememberedStudentCard} from '../src/types/system';
const css=readFileSync('src/index.css','utf8');
it('applies baseline and defines all referenced stage palettes',()=>{
 const style=document.createElement('style');style.textContent=css;document.head.append(style);
 try{const root=getComputedStyle(document.documentElement);expect(root.getPropertyValue('--font-body')).toContain('Lexend');expect(root.getPropertyValue('--space-16')).toBe('64px');expect(root.getPropertyValue('--radius-full')).toBe('9999px');expect(root.getPropertyValue('--feedback-success')).toBe('#10B981');for(const token of css.matchAll(/var\((--s[1-4]-[\w-]+)\)/g))expect(root.getPropertyValue(token[1]),token[1]).not.toBe('')}finally{style.remove()}
});
it.skipIf(process.env.CORE_BROWSER_CHECK!=='1')('computes all four stage palettes in a real browser',async()=>{
 const {chromium}=await import('@playwright/test');const browser=await chromium.launch();
 try{const page=await browser.newPage();await page.setContent(`<style>${css}</style><main id="app-root"><div class="card">Stage</div></main>`);
 for(const [stage,background,primary,text] of [['playful','rgb(254, 243, 199)','rgb(245, 158, 11)','rgb(30, 41, 59)'],['guided','rgb(248, 250, 252)','rgb(79, 70, 229)','rgb(15, 23, 42)'],['dashboard','rgb(241, 245, 249)','rgb(29, 78, 216)','rgb(15, 23, 42)'],['studio','rgb(15, 23, 42)','rgb(99, 102, 241)','rgb(248, 250, 252)']]){
 await page.evaluate(stage=>{document.documentElement.dataset.stage=stage},stage);expect(await page.locator('#app-root').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe(background);expect(await page.locator('#app-root').evaluate(el=>getComputedStyle(el).color)).toBe(text);expect(await page.evaluate(()=>{const el=document.createElement('span');el.style.color='var(--color-primary)';document.body.append(el);const color=getComputedStyle(el).color;el.remove();return color})).toBe(primary);
 }}finally{await browser.close()}
});
it('uses plain text until native speech supplies word boundaries',()=>{
 const words:number[]=[];const fallback:string[]=[];let utterance:SpeechSynthesisUtterance|undefined;
 class Utterance {constructor(public text:string){} }
 vi.stubGlobal('SpeechSynthesisUtterance',Utterance);vi.stubGlobal('speechSynthesis',{cancel:()=>{},getVoices:()=>[],speak:(u:SpeechSynthesisUtterance)=>{utterance=u}});
 try{speakText('Hello world',{onWord:i=>words.push(i),onFallback:t=>fallback.push(t)});utterance!.onstart?.({} as SpeechSynthesisEvent);expect(words).toEqual([-1]);expect(fallback).toEqual(['Hello world']);utterance!.onboundary?.({name:'word',charIndex:6} as SpeechSynthesisEvent);expect(words).toEqual([-1,1]);utterance!.onend?.({} as SpeechSynthesisEvent);expect(words).toEqual([-1,1,-1])}finally{stopSpeech();vi.unstubAllGlobals()}
});
it('recovers the durable IndexedDB snapshot when localStorage writes fail',async()=>{
 const snapshot={studentId:'idb-only',stage:'guided' as const,moduleKey:'typing' as const,lessonId:'drill',charIndex:9,wpm:0,timestamp:Date.now()};const spy=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('quota')});
 try{recordBrownoutSnapshot(snapshot);flushBrownoutSnapshot();await vi.waitFor(async()=>expect(await idbGet('brownout_store','idb-only')).toBeDefined());expect(getBrownoutSnapshot('idb-only')).toBeNull();expect(await brownout.getBrownoutSnapshotAsync('idb-only')).toMatchObject({charIndex:9})}finally{spy.mockRestore();clearSnapshot('idb-only')}
});
it.each([{studentId:'wrong',offset:0},{studentId:'invalid',offset:-7200001},{studentId:'invalid',offset:60001}])('validates IndexedDB recovery identity and timestamp: %j',async fields=>{
 vi.useFakeTimers({toFake:['Date']});
 try{await idbPut('brownout_store','invalid',{studentId:fields.studentId,timestamp:Date.now()+fields.offset,stage:'guided',moduleKey:'typing',lessonId:'drill',charIndex:1,wpm:0});expect(await brownout.getBrownoutSnapshotAsync('invalid')).toBeNull()}finally{vi.useRealTimers();clearSnapshot('invalid')}
});
describe('PIN security',()=>{
 it('preserves leading zeroes and verifies only the salted PIN',async()=>{const salt=generateSalt();const h=await hashPin('0000',salt);expect(h).not.toBe('0000');expect(await verifyPin('0000',h,salt)).toBe(true);expect(await verifyPin('0001',h,salt)).toBe(false);expect(await hashPin('0000',generateSalt())).not.toBe(h);});
 it('rejects malformed PINs',async()=>{await expect(hashPin('123',generateSalt())).rejects.toThrow();expect(await verifyPin('abcd','deadbeef',generateSalt())).toBe(false);});
});
describe('accuracy-first telemetry',()=>{it('counts errors without negative speed or division by zero',()=>{expect(computeAccuracy(9,10)).toBe(90);expect(computeAccuracy(0,0)).toBe(100);expect(computeWpm(50,60000)).toBe(10);expect(computeNetWpm(50,20,60000)).toBe(0);expect(updateStreak(4,false)).toBe(0);});});
describe('device persistence',()=>{
 it('keeps the 20 most recent public cards, supports removal, and omits credentials',()=>{for(let i=0;i<22;i++)saveRememberedCard({studentId:String(i),schoolCode:'TEST',displayName:'Student '+i,gradeLevel:'elem_lower',isHighSchoolFoundations:false,avatarId:'mango',lastLoginAt:new Date(i*1000).toISOString(),pinHash:'secret'} as RememberedStudentCard);const cards=loadRememberedStudents();expect(cards).toHaveLength(20);expect(cards.some(c=>c.studentId==='0')).toBe(false);expect(JSON.stringify(cards)).not.toContain('secret');removeRememberedCard('21');expect(loadRememberedStudents()).toHaveLength(19);});
 it('saves progress offline and flushes the durable local queue online',async()=>{Object.defineProperty(navigator,'onLine',{value:false,configurable:true});await saveProgressSnapshot({studentId:'offline-student',completedLessons:['tech-1']} as never);expect((await loadProgress('offline-student'))?.completedLessons).toEqual(['tech-1']);expect((await getOfflineMutationQueue()).length).toBeGreaterThan(0);Object.defineProperty(navigator,'onLine',{value:true,configurable:true});await flushOfflineMutationQueue();expect(await getOfflineMutationQueue()).toHaveLength(0);});
});
describe('brownout recovery',()=>{
 afterEach(()=>{vi.useRealTimers();clearSnapshot('one');clearSnapshot('two');});
 it('persists after 3 seconds, separates students and ignores stale snapshots',()=>{vi.useFakeTimers();recordBrownoutSnapshot({studentId:'one',stage:'guided',moduleKey:'typing',lessonId:'type-s2-d01',charIndex:20,wpm:0,timestamp:Date.now()});expect(getBrownoutSnapshot('one')).toBeNull();vi.advanceTimersByTime(3000);expect(getBrownoutSnapshot('one')?.charIndex).toBe(20);expect(getBrownoutSnapshot('two')).toBeNull();vi.advanceTimersByTime(7200001);expect(getBrownoutSnapshot('one')).toBeNull();});
 it('flushes the latest pending character on page exit',()=>{recordBrownoutSnapshot({studentId:'two',stage:'studio',moduleKey:'typing',lessonId:'type-s2-d01',charIndex:21,wpm:0,timestamp:Date.now()});flushBrownoutSnapshot();expect(getBrownoutSnapshot('two')?.charIndex).toBe(21);clearSnapshot('two');expect(getBrownoutSnapshot('two')).toBeNull();});
});
