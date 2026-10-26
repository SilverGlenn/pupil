import {test,expect,type Page} from '@playwright/test';
import {login,modulePage} from './helpers';
import {techLessons} from '../../src/data/techLessons';
import {sentenceScrambleBank} from '../../src/data/gameData';

async function saved(page:Page,moduleKey:string,check:(s:any)=>boolean){
 await expect.poll(async()=>{
  const snapshots=await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('pupil_brownout_')).map(k=>JSON.parse(localStorage.getItem(k)!)));
  return snapshots.some(s=>s.moduleKey===moduleKey&&check(s));
 },{timeout:7000}).toBe(true);
}
const header=(page:Page,name:string)=>page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name,exact:true});

// Catches competing CSS transforms, clipped targets and pointer catches that synthetic clicks miss.
for(const studio of [false,true])for(const touch of [false,true])for(const reduced of [false,true])test(`F1 ${studio?'capsule':'mango'} ${touch?'touch':'mouse'} reduced=${reduced}: geometry, pause and catch`,async({browser},testInfo)=>{
 const context=await browser.newContext({hasTouch:touch,reducedMotion:reduced?'reduce':'no-preference',viewport:{width:1280,height:900}});
 const page=await context.newPage();try{
  await login(page,studio?'Mark Santos':'Aya Cruz',studio?'4444':'1111');await modulePage(page,'games');
  await page.getByRole('button',{name:studio?'Key capsules':'Mango Catcher',exact:true}).click();await page.getByLabel('Slower drops').check();
  const area=page.getByLabel('Falling play area');await area.scrollIntoViewIfNeeded();const target=area.locator('.falling-item').last();
  await expect.poll(()=>target.evaluate(el=>{const r=el.getBoundingClientRect(),a=el.parentElement!.getBoundingClientRect();return r.top>=a.top+10&&r.bottom<=a.bottom-10}),{timeout:5000}).toBe(true);
  await page.getByRole('button',{name:'Pause drops',exact:true}).click();
  const y=await target.evaluate(el=>el.getBoundingClientRect().y);await page.waitForTimeout(350);expect(await target.evaluate(el=>el.getBoundingClientRect().y)).toBeCloseTo(y,1);
  expect(await target.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  await page.getByRole('button',{name:'Resume drops',exact:true}).click();await area.scrollIntoViewIfNeeded();
  await expect.poll(()=>target.evaluate(el=>el.getBoundingClientRect().y)).toBeGreaterThan(y+2);
  const point=await target.evaluate(el=>{const r=el.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;return {x,y,hit:el.contains(document.elementFromPoint(x,y)),animation:getComputedStyle(el).animationName,target:{top:r.top,bottom:r.bottom},area:{top:el.parentElement!.getBoundingClientRect().top,bottom:el.parentElement!.getBoundingClientRect().bottom}}});expect(point.hit).toBe(true);
  if(touch)await page.touchscreen.tap(point.x,point.y);else await page.mouse.click(point.x,point.y);
  await expect(page.getByText('Round: 1/15',{exact:true})).toBeVisible();await expect(page.getByText(/^Score: [1-9]/)).toBeVisible();
  await testInfo.attach('falling-pointer-receipt',{body:JSON.stringify({studio,touch,reduced,pausedY:y,...point,score:await page.getByText(/^Score: /).textContent()}),contentType:'application/json'});
 }finally{await context.close()}
});

// Catches a restored tech snapshot continuing to block other modules after Header navigation.
test('F2 tech Resume is consumed; Header typing, game input and subsequent autosaves work',async({page})=>{
 await login(page);await modulePage(page,'tech');const lesson=techLessons.find(l=>l.level==='elem_lower'&&l.slides.length>=3)!;
 await page.getByRole('button',{name:`Open lesson: ${lesson.title}`,exact:true}).click();for(let i=0;i<2;i++)await page.getByRole('button',{name:'Next slide',exact:true}).click();
 await saved(page,'tech',s=>s.slideIndex===2);await page.reload();await login(page);await page.getByRole('button',{name:'Resume',exact:true}).click();
 await expect(page.getByRole('heading',{name:lesson.slides[2].headline,exact:true})).toBeVisible();await header(page,'Typing').click();
 await page.getByLabel('Typing practice area').click();await page.keyboard.type('a');await page.getByRole('button',{name:'a',exact:true}).click();await expect(page.getByText('Characters: 2/29',{exact:true})).toBeVisible();
 await saved(page,'typing',s=>s.charIndex===2);await header(page,'Games').click();await page.getByRole('button',{name:'Mango Catcher',exact:true}).click();
 await page.keyboard.press('a');await expect(page.getByText('Round: 1/15',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Pause drops',exact:true}).click();
 await saved(page,'games',s=>s.lessonId==='mango_catcher'&&s.state.session.score>0);
});

// Catches passive recovery hydration being ignored by an already-initialized first-puzzle rack.
for(const [name,pin,level,standard] of [['Aya Cruz','1111','level_1',false],['Joshua Dizon','2222','level_2',false],['Bea Ramos','3333','level_3',false],['Mark Santos','4444','track_4b',false],['Mark Santos','4444','track_4b',true]] as const)test(`F3 ${name} standard=${standard}: first and later puzzle racks survive real autosave/reopen/Resume`,async({page,context})=>{
 await login(page,name,pin);if(standard)await page.getByLabel('Start from Basics').uncheck();await modulePage(page,'games');await page.getByRole('button',{name:'Sentence Scramble',exact:true}).click();
 const puzzles=sentenceScrambleBank.filter(p=>p.level===level);
 for(let index=0;index<2;index++){
  const words=puzzles[index].correctSentence.split(/\s+/),partial=[words.at(-1)!,words[0]];
  for(const word of partial)await page.locator('.tile-pool').getByRole('button',{name:word,exact:true}).first().click();
  const before=await page.locator('.tile-rack button').allTextContents();expect(before).toEqual(partial);
  await saved(page,'games',s=>s.lessonId==='sentence_scramble'&&s.state.session.index===index&&s.state.session.selection.length===2);
  await page.close();page=await context.newPage();await login(page,name,pin);await page.getByRole('button',{name:'Resume',exact:true}).click();
  await expect(page.locator('.tile-rack button')).toHaveText(partial);
  for(const word of partial)await expect(page.locator('.tile-pool').getByRole('button',{name:word,exact:true}).first()).toBeDisabled();
  // Continue ordinary editing, not a manufactured solved session.
  await page.getByRole('button',{name:'Undo',exact:true}).click();await expect(page.locator('.tile-rack button')).toHaveText([partial[0]]);await page.getByRole('button',{name:'Reset',exact:true}).click();
  for(const word of words)await page.locator('.tile-pool button:enabled').filter({hasText:new RegExp('^'+word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$')}).first().click();
  await page.getByRole('button',{name:'Check sentence',exact:true}).click();await expect(page.getByText(new RegExp(`Score: ${(index+1)*100} · Puzzle ${index+2}/`))).toBeVisible();
 }
});
