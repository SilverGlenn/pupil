import {test,expect} from '@playwright/test';
import {login,modulePage,progress} from './helpers';
import {typingDrills} from '../../src/data/typingDrills';
import {mkdirSync} from 'node:fs';
const shots='test-results/screenshots';
test.beforeEach(()=>mkdirSync(shots,{recursive:true}));
test('TC-02/03/04/05: real crypto login, PIN security, four computed skins, neutral bridge and portal',async({page})=>{
 const external:string[]=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4173'))external.push(r.url())});
 await page.goto('/');for(const name of ['Aya Cruz','Joshua Dizon','Bea Ramos','Mark Santos'])await expect(page.getByRole('button',{name:`Sign in as ${name}`})).toBeVisible();
 await page.screenshot({path:shots+'/auth.png',fullPage:true});
 const accounts=[['Aya Cruz','1111','playful','rgb(254, 243, 199)'],['Joshua Dizon','2222','guided','rgb(248, 250, 252)'],['Bea Ramos','3333','dashboard','rgb(241, 245, 249)'],['Mark Santos','4444','studio','rgb(15, 23, 42)']];
 for(const [name,pin,stage,color] of accounts){
  await page.getByRole('button',{name:`Sign in as ${name}`}).click();
  const key=page.getByRole('button',{name:'1',exact:true});const size=await key.boundingBox();expect(size!.width).toBeGreaterThanOrEqual(64);expect(size!.height).toBeGreaterThanOrEqual(64);
  if(stage==='playful'){await page.keyboard.type('9999');await expect(page.getByText('Check with your teacher or try again!')).toBeVisible()}
  await page.keyboard.type(pin);await expect(page.getByRole('button',{name:'Switch student',exact:true})).toBeVisible();await expect(page.locator('#app-root')).toHaveAttribute('data-stage',stage);
  expect(await page.locator('#app-root').evaluate(e=>getComputedStyle(e).backgroundColor)).toBe(color);
  await page.screenshot({path:`${shots}/${stage}.png`,fullPage:true});
  if(stage==='studio'){
   const old=await page.evaluate(()=>performance.timeOrigin);await page.keyboard.press('Alt+f');await expect(page.getByLabel('Start from Basics')).not.toBeChecked();await page.keyboard.press('Alt+f');await expect(page.getByLabel('Start from Basics')).toBeChecked();
   await modulePage(page,'typing');await expect(page.getByLabel('Choose a drill')).toHaveValue('type-s2-d01');expect(await page.locator('#app-root').evaluate(e=>getComputedStyle(e).backgroundColor)).toBe(color);expect(await page.evaluate(()=>performance.timeOrigin)).toBe(old);
   await page.getByRole('button',{name:'Home',exact:true}).click();
  }
  await page.getByRole('button',{name:'Switch student',exact:true}).click();
 }
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('pupil_student_accounts')!));for(const student of stored){expect(student.pinHash).toMatch(/^[a-f0-9]{64}$/i);expect(student.pinSalt).toMatch(/^[a-f0-9]{32}$/i);for(const key of ['pin','passcode','password'])expect(student[key]).toBeUndefined()}
 const raw=await page.evaluate(()=>Object.values(localStorage).join('\n'));for(const pin of ['1111','2222','3333','4444','1234'])expect(raw).not.toContain(`"${pin}"`);
 await page.getByRole('button',{name:'Teacher / Parent Access'}).click();await page.getByLabel('Teacher passcode').fill('1234');await page.getByRole('button',{name:'Unlock portal'}).click();await expect(page.getByRole('heading',{name:'Student roster'})).toBeVisible();await expect(page.getByText(/Tech current course:/).first()).toBeVisible();await page.screenshot({path:shots+'/portal.png',fullPage:true});expect(external).toEqual([]);
});
test('TC-06: real tab close/reopen restores drill 3 at exact character 20 after autosave; completed drill has no banner',async({page,context})=>{
 await login(page);await modulePage(page,'typing');await page.getByLabel('Choose a drill').selectOption('type-s2-d03');await page.getByLabel('Typing practice area').click();const target='asdf jkl; asdf jkl; a; s l d k f j';await page.keyboard.type(target.slice(0,20));await expect(page.getByText('Characters: 20/34',{exact:true})).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('pupil_brownout_')).map(k=>JSON.parse(localStorage.getItem(k)!)).some(s=>s.lessonId==='type-s2-d03'&&s.charIndex===20)),{timeout:6000}).toBe(true);
 await page.close();const reopened=await context.newPage();await login(reopened);await reopened.getByRole('button',{name:/Resume/}).click();await expect(reopened.getByLabel('Choose a drill')).toHaveValue('type-s2-d03');await expect(reopened.getByText('Characters: 20/34',{exact:true})).toBeVisible();await reopened.getByLabel('Typing practice area').click();await reopened.keyboard.type(target.slice(20));await expect(reopened.getByText('Drill complete. Your result is saved.')).toBeVisible();await reopened.reload();await login(reopened);await expect(reopened.getByRole('button',{name:/Resume/})).toHaveCount(0);
});
test('TC-10/13: physical and touch exact characters/Shift, 56px keys, offline completion and real IndexedDB queue drain',async({page,context})=>{
 await login(page,'Mark Santos','4444');await modulePage(page,'typing');await page.getByLabel('Choose a drill').selectOption('type-s6-d01');await expect(page.getByLabel('Choose a drill')).toHaveValue('type-s6-d01');
 const target=typingDrills.find(d=>d.drillId==='type-s6-d01')!.targetText;
 await page.getByLabel('Typing practice area').click();await page.keyboard.type(target.slice(0,8));await expect(page.getByText(`Characters: 8/${target.length}`,{exact:true})).toBeVisible();expect(await page.locator('.typing-stream [data-state="correct"]').first().evaluate(e=>getComputedStyle(e).color)).toBe('rgb(4, 120, 87)');await page.getByRole('button',{name:'Listen',exact:true}).click();await page.keyboard.type(target.slice(8));await expect(page.getByText('Drill complete. Your result is saved.')).toBeVisible();
 await page.getByLabel('Choose a drill').selectOption('type-s6-d03');await page.getByLabel('Typing practice area').click();await page.keyboard.press('Shift+Digit2');await page.getByRole('button',{name:'Left Shift',exact:true}).click();await page.getByRole('button',{name:'@',exact:true}).click();await expect(page.getByText(`Characters: 2/${typingDrills.find(d=>d.drillId==='type-s6-d03')!.targetText.length}`,{exact:true})).toBeVisible();await page.getByRole('button',{name:'Listen',exact:true}).click();await page.keyboard.type(' student@school teacher@class info@deped');await expect(page.getByText('Drill complete. Your result is saved.')).toBeVisible();
 await page.getByLabel('Choose a drill').selectOption('type-s1-d01');await page.getByLabel('Typing practice area').click();
 const key=page.locator('.key').first();const geometry=await key.evaluate(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,gap:getComputedStyle(e.parentElement!).gap}));expect(geometry.w).toBeGreaterThanOrEqual(56);expect(geometry.h).toBeGreaterThanOrEqual(56);expect(geometry.gap).toBe('8px');
 await page.evaluate(async()=>{await navigator.serviceWorker.ready});await context.setOffline(true);await expect(page.getByText(/Offline · Local save/)).toBeVisible();
 for(const char of 'a a o o a o a o aa oo')await page.getByRole('button',{name:char===' '?'Space':char,exact:true}).click();
 await expect(page.getByText('Drill complete. Your result is saved.')).toBeVisible();
 await expect.poll(()=>page.evaluate(async()=>{const db=await new Promise<IDBDatabase>((res,rej)=>{const r=indexedDB.open('pupil-ph',1);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});return new Promise<number>(res=>{const r=db.transaction('mutation_queue').objectStore('mutation_queue').count();r.onsuccess=()=>{res(r.result);db.close()}})})).toBeGreaterThan(0);
 await context.setOffline(false);await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('pupil_offline_mutation_queue')||'[]').length)).toBe(0);
 await expect.poll(()=>page.evaluate(async()=>{const db=await new Promise<IDBDatabase>(res=>{const r=indexedDB.open('pupil-ph',1);r.onsuccess=()=>res(r.result)});return new Promise<number>(res=>{const r=db.transaction('mutation_queue').objectStore('mutation_queue').count();r.onsuccess=()=>{res(r.result);db.close()}})})).toBe(0);
 const saved=Object.values(await progress(page)) as any[];expect(saved.some(p=>p.typingProgress.completedDrills['type-s1-d01']?.accuracy===100)).toBe(true);
 await page.screenshot({path:shots+'/typing.png',fullPage:true});
});
test('TC-11: real falling game mango and studio capsule skins',async({page})=>{
 await login(page,'Aya Cruz','1111');await modulePage(page,'games');await page.getByRole('button',{name:'Mango Catcher',exact:true}).click();await expect(page.locator('.mango-item').first()).toBeVisible();await page.getByRole('button',{name:'Switch student',exact:true}).click();await login(page,'Mark Santos','4444');await modulePage(page,'games');await page.getByRole('button',{name:'Key capsules',exact:true}).click();await expect(page.locator('.key-capsule').first()).toBeVisible();await expect(page.locator('.mango-item')).toHaveCount(0);
});
