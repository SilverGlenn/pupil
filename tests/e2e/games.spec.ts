import {test,expect} from '@playwright/test';
import {login,modulePage,dismissRecovery} from './helpers';
import {jeepneyWordBank,sentenceScrambleBank,detectiveFileBank,scamDatabase} from '../../src/data/gameData';
import {mkdirSync} from 'node:fs';
test('Jeepney full 15-stop bank: real focused arrows/Enter and picture screenshots',async({page})=>{
 await login(page,'Mark Santos','4444');await modulePage(page,'games');await page.getByRole('button',{name:'Transit word express',exact:true}).click();mkdirSync('test-results/picture-bank',{recursive:true});let count=0;
 for(const tier of [1,2,3,4]){await page.getByLabel('Choose route tier').selectOption(String(tier));for(const round of jeepneyWordBank.filter(r=>r.tier===tier)){
  await expect(page.getByRole('heading',{name:round.targetWord,exact:true})).toBeVisible();await page.locator('.game-arena').screenshot({path:`test-results/picture-bank/${round.id}.png`});
  const pictures=page.getByRole('group',{name:'Picture choices'}).getByRole('button');const names=await pictures.evaluateAll(elements=>elements.map(e=>e.getAttribute('aria-label')!));const correct=names.findIndex(name=>name.endsWith(': '+round.correctImage));expect(correct).toBeGreaterThanOrEqual(0);
  const wrong=(correct+1)%names.length;await pictures.nth(wrong).focus();await page.keyboard.press('Enter');await expect(page.getByText('Try another picture. You can do it.',{exact:true})).toBeVisible();
  for(let step=0;step<names.length;step++){if(await pictures.nth(correct).evaluate(e=>e===document.activeElement))break;await page.keyboard.press('ArrowRight')}
  await expect(pictures.nth(correct)).toBeFocused();await page.keyboard.press('Enter');count++;
 }await expect(page.getByText('Route complete. Your score is saved.')).toBeVisible()}
 expect(count).toBe(15);
});
test('all 20 scramble puzzles including sb-01/sb-08/sb-14 are solvable from displayed tokens; bridge reuses mature bank',async({page})=>{
 test.setTimeout(90000);let count=0;
 for(const [name,pin,level] of [['Aya Cruz','1111','level_1'],['Joshua Dizon','2222','level_2'],['Bea Ramos','3333','level_3'],['Mark Santos','4444','track_4b']]){
  await login(page,name,pin);await dismissRecovery(page);if(name==='Mark Santos')await expect(page.getByLabel('Start from Basics')).toBeChecked();await modulePage(page,'games');await page.getByRole('button',{name:'Sentence Scramble',exact:true}).click();
  for(const puzzle of sentenceScrambleBank.filter(p=>p.level===level)){
   for(const token of puzzle.correctSentence.split(/\s+/)){const escaped=token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');await page.locator('.tile-pool button:enabled').filter({hasText:new RegExp('^'+escaped+'$')}).first().click()}
   await page.getByRole('button',{name:'Check sentence',exact:true}).click();count++;
  }await expect(page.getByText('Puzzles complete. Your score is saved.')).toBeVisible();await page.getByRole('button',{name:'Switch student',exact:true}).click();
 }
 expect(count).toBe(20);
});
for(const touch of [false,true])test(`Tech Detective complete sequence with genuine ${touch?'emulated touch':'mouse'} USB drag and full safety bank`,async({page,context})=>{
 test.setTimeout(60000);await login(page,'Mark Santos','4444');await modulePage(page,'games');await page.getByRole('button',{name:'Tech Detective',exact:true}).click();for(let i=1;i<=3;i++)await page.getByRole('button',{name:`Tap target ${i}`,exact:true}).click();await page.getByRole('button',{name:'Open document with a double click'}).dblclick();
 const usb=page.getByRole('button',{name:'USB drive',exact:true}),dock=page.getByRole('button',{name:'Eject USB dock',exact:true});await usb.click();await dock.click();await expect(page.getByRole('heading',{name:'Safely eject the USB drive'})).toBeVisible();
 if(!touch)await usb.dragTo(dock);else{
  await usb.scrollIntoViewIfNeeded();const a=await usb.boundingBox(),b=await dock.boundingBox();const cdp=await context.newCDPSession(page);const point=(x:number,y:number)=>({x,y,radiusX:1,radiusY:1,force:1,id:1});const start={x:a!.x+a!.width/2,y:a!.y+a!.height/2},end={x:b!.x+b!.width/2,y:b!.y+b!.height/2};await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(start.x,start.y)]});for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point(start.x+(end.x-start.x)*i/8,start.y+(end.y-start.y)*i/8)]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
 }
 await expect(page.getByRole('heading',{name:'File sorting',exact:true})).toBeVisible();for(const file of detectiveFileBank){await page.getByRole('button',{name:file.name,exact:true}).click();await page.getByRole('button',{name:file.correctFolderId,exact:true}).click()}
 for(const [i,scenario] of scamDatabase.entries()){await expect(page.getByRole('heading',{name:`Safe or scam · Case ${i+1}/${scamDatabase.length}`,exact:true})).toBeVisible();await page.getByRole('button',{name:scenario.isScam?'Scam message':'Safe message',exact:true}).click()}
 await expect(page.getByText('All missions complete. Your badge and score are saved.')).toBeVisible();
});
