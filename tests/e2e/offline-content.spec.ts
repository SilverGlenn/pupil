import {test,expect} from '@playwright/test';
import {login,modulePage,dismissRecovery} from './helpers';
import {techLessons} from '../../src/data/techLessons';
import {vocabCards} from '../../src/data/englishVocab';
import {sentenceExercises} from '../../src/data/englishSentences';
import {storyPassages} from '../../src/data/englishStories';
import {typingDrills} from '../../src/data/typingDrills';
test('TC-12 exhaustive offline content: 35 lessons/all slides, 75 cards, 30 builders, 13 stories, 60 drills, four game entries',async({page,context})=>{
 test.setTimeout(180000);await page.goto('/');await page.evaluate(async()=>{await navigator.serviceWorker.ready});await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);await context.setOffline(true);await page.reload();
 let lessons=0,cards=0,sentences=0,stories=0;
 for(const [name,pin,level,track] of [['Aya Cruz','1111','preschool','level_1'],['Joshua Dizon','2222','elem_lower','level_2'],['Bea Ramos','3333','elem_upper','level_3'],['Mark Santos','4444','highschool','track_4a'],['Mark Santos','4444','highschool','track_4b']]){
  await login(page,name,pin);await dismissRecovery(page);if(track==='track_4b')await page.keyboard.press('Alt+f');
  await modulePage(page,'tech');
  for(const lesson of techLessons.filter(l=>l.level===level&&(level!=='highschool'||!!l.isFoundationBridge===(track==='track_4a')))){
   await page.getByRole('button',{name:`Open lesson: ${lesson.title}`,exact:true}).click();
   for(const [i,slide] of lesson.slides.entries()){
    await expect(page.getByRole('heading',{name:slide.headline,exact:true})).toBeVisible();await expect(page.locator('.reading-prompt').first()).toHaveText(slide.bodyText.replace(/\s+/g,' '));
    if(i<lesson.slides.length-1)await page.getByRole('button',{name:'Next slide',exact:true}).click();
   }
   await page.getByRole('button',{name:'Back to lessons',exact:true}).click();lessons++;
  }
  await modulePage(page,'english');
  const bank=vocabCards.filter(c=>c.level===track);for(const [i,card] of bank.entries()){
   await expect(page.getByRole('heading',{name:card.term,exact:true})).toBeVisible();await page.getByRole('button',{name:'Flip card',exact:true}).click();await expect(page.getByText(card.definition,{exact:true})).toBeVisible();if(i<bank.length-1)await page.getByRole('button',{name:'Next card',exact:true}).click();cards++;
  }
  await page.getByRole('button',{name:'Build sentences',exact:true}).click();for(const item of sentenceExercises.filter(s=>s.level===track)){await page.getByLabel('Choose an English activity').selectOption(item.id);await expect(page.getByText(item.promptInstruction,{exact:true})).toBeVisible();sentences++}
  await page.getByRole('button',{name:'Read stories',exact:true}).click();for(const story of storyPassages.filter(s=>s.level===track)){await page.getByLabel('Choose an English activity').selectOption(story.id);await expect(page.getByRole('heading',{name:story.title,exact:true})).toBeVisible();for(const q of story.quiz)await expect(page.getByText(q.questionText,{exact:true})).toBeVisible();stories++}
  await page.getByRole('button',{name:'Switch student',exact:true}).click();
 }
 expect({lessons,cards,sentences,stories}).toEqual({lessons:35,cards:75,sentences:30,stories:13});
 await login(page,'Mark Santos','4444');await dismissRecovery(page);await modulePage(page,'typing');for(const drill of typingDrills){await page.getByLabel('Choose a drill').selectOption(drill.drillId);await expect(page.locator('.typing-stream')).toHaveText(drill.targetText)}
 await modulePage(page,'games');for(const label of ['Transit word express','Key capsules','Sentence Scramble','Tech Detective']){await page.getByRole('button',{name:label,exact:true}).click();await expect(page.locator('main .game-arena').first()).toBeVisible()}
 console.log('TC12 offline rendered',{lessons,cards,sentences,stories,drills:typingDrills.length,games:4});
});
