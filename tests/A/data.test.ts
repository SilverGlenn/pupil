import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import {hashPin,verifyPin,generateSalt} from '../../src/utils/cryptoPin';
const modules=import.meta.glob('../../src/data/*.ts',{eager:true}) as Record<string,Record<string,any>>;
const bank=(file:string,key:string)=>modules[`../../src/data/${file}.ts`]?.[key]??[];
const tech=bank('techLessons','techLessons'),vocab=bank('englishVocab','vocabCards'),sentences=bank('englishSentences','sentenceExercises'),stories=bank('englishStories','storyPassages'),drills=bank('typingDrills','typingDrills');
const source=(name:string)=>readFileSync(`curriculum/${name}.md`,'utf8');
const english=source('02-basic-english-curriculum'),typing=source('03-typing-and-games-spec'),techSource=source('01-tech-literacy-curriculum');
const clean=(s:string)=>s.replace(/`|\*\*/g,'').replace(/\*(.*?)\*/g,'$1').trim();
describe('approved curriculum banks',()=>{
 it('exports every approved item with unique durable IDs',()=>{
  for(const [items,count,key] of [[tech,35,'lessonId'],[vocab,75,'id'],[sentences,30,'id'],[stories,13,'id'],[drills,60,'drillId'],[bank('gameData','jeepneyWordBank'),15,'id'],[bank('gameData','sentenceScrambleBank'),20,'id']] as const){expect(items).toHaveLength(count);expect(new Set(items.map((x:any)=>x[key])).size).toBe(count)}
  expect(new Set(tech.map((x:any)=>x.moduleId)).size).toBe(13);
 });
 it('retains all vocabulary definitions, examples, visual descriptions and pronunciation copy',()=>{
  expect(vocab).toHaveLength(75);
  for(const m of english.matchAll(/#### Card (\S+): ([^\n]+)\n([\s\S]*?)(?=\n#### |\n---)/g)){
   const card=vocab.find((x:any)=>x.id===m[1]);expect(card,m[1]).toBeDefined();
   for(const [label,key] of [['Word / Phrase','term'],['Ultra-Simple Definition','definition'],['Example Sentence','exampleSentence']] )expect(card[key]).toBe(m[3].match(new RegExp(`\\*\\*${label}:\\*\\* (.*)`))![1]);
   expect(card.visualAsset.designPrompt).toBe(m[3].match(/Description:\*\* (.*)/)![1]);
   expect(card.audioGuide.phoneticSpelling.length).toBeGreaterThan(2);
  }
 });
 it('retains every exact typing target including case, whitespace and symbols',()=>{
  const targets=[...typing.matchAll(/- \*\*targetText\*\*: `([^\n]*)`/g)].map(m=>m[1]);
  expect(drills.map((d:any)=>d.targetText)).toEqual(targets);expect(targets).toHaveLength(60);
  for(let stage=1;stage<=6;stage++)expect(drills.filter((d:any)=>d.stageNumber===stage)).toHaveLength(10);
 });
 it('keeps track counts, sentence distractors and complete passage option feedback',()=>{
  for(const track of ['level_1','level_2','level_3','track_4a','track_4b']){expect(vocab.filter((v:any)=>v.level===track)).toHaveLength(15);expect(sentences.filter((s:any)=>s.level===track)).toHaveLength(6)}
  expect(stories.map((s:any)=>s.quiz.length)).toEqual(Array(13).fill(3));
  for(const s of sentences){expect(s.distractorTiles).toHaveLength(2);expect(s.targetTiles.join(' ').replace(/[.?]$/,'')).toBe(s.targetSentence.replace(/[.?]$/,''))}
  for(const s of stories)for(const q of s.quiz){expect(q.options).toHaveLength(4);expect(q.options.filter((o:any)=>o.isCorrect)).toHaveLength(1);for(const o of q.options)expect(o.feedback.length).toBeGreaterThan(10)}
 });
 it('retains every tech card, full narration, tips and correct/incorrect feedback',()=>{
  const sections=[...techSource.matchAll(/#### Lesson ([\w.]+): ([^\n]+)\n([\s\S]*?)(?=\n#### Lesson|\n### Module|\n## 4\.)/g)];expect(tech).toHaveLength(35);
  for(const m of sections){const l=tech.find((x:any)=>x.lessonId===`LES-${m[1]}`);expect(l,m[1]).toBeDefined();expect(l.title).toBe(clean(m[2]));
   const cards=[...m[3].matchAll(/- \*Card \d+:\* "([\s\S]*?)"(?=\n  - \*Card|\n- \*\*Audio)/g)].map(c=>clean(c[1].replace(/\n\s+/g,'\n')));
   expect(l.slides.map((s:any)=>s.bodyText)).toEqual(cards);for(const s of l.slides)expect(s.ttsAudioText).toBe(s.bodyText);
   expect(l.voiceoverScript).toBe(clean(m[3].match(/Voiceover Script:\*\*\n\s*> "([\s\S]*?)"\n/)![1]));
   expect(l.realLifeTip.length).toBeGreaterThan(20);expect(l.visualDescription.length).toBeGreaterThan(20);
   for(const q of l.quiz){expect(q.options).toHaveLength(4);expect(q.correctIndex).toBeGreaterThanOrEqual(0);expect(q.correctIndex).toBeLessThan(4);expect(q.incorrectExplanation.length).toBeGreaterThan(10)}
   expect(l.isFoundationBridge).toBe(m[1].startsWith('4A'));
  }
 });
 it('provides graded key pools and all nine detailed scam scenarios',()=>{
  const pools=bank('gameData','fallingKeysPool');expect(pools[1]).toEqual(['A','E','I','O','U']);expect(pools[3]).toHaveLength(26);expect(pools[4]).toContain('@');
  const cases=bank('gameData','scamDatabase');expect(cases.length).toBeGreaterThanOrEqual(9);expect(cases.filter((c:any)=>!c.isScam).length).toBeGreaterThanOrEqual(3);
  for(const c of cases){expect(c.messageBody.length).toBeGreaterThan(20);expect(c.explanationFeedback.length).toBeGreaterThan(20);expect(c.inspectionClues.senderClue).toBeTruthy();expect(c.inspectionClues.urlClue).toBeTruthy();expect(c.inspectionClues.urgencyClue).toBeTruthy();if(c.isScam)expect(c.redFlagsList.length).toBeGreaterThan(0)}
 });
 it('authenticates the hashed demo roster and returns isolated seed objects',async()=>{
  Object.defineProperty(globalThis,'crypto',{value:webcrypto,configurable:true});
  const factory=modules['../../src/data/initialRoster.ts']?.createInitialRoster;expect(factory).toBeTypeOf('function');if(!factory)return;
  const a=await factory(),b=await factory();expect(a.school.schoolCode).toBe('MABINI-01');expect(a.students).toHaveLength(4);
  expect(await verifyPin('1234',a.school.adminPasscodeHash,a.school.adminPasscodeSalt)).toBe(true);
  for(const [i,pin] of ['1111','2222','3333','4444'].entries()){const s=a.students[i];expect(await verifyPin(pin,s.pinHash,s.pinSalt)).toBe(true);expect(await verifyPin('9999',s.pinHash,s.pinSalt)).toBe(false);expect(s.studentId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);expect(s).not.toHaveProperty('pin')}
  expect(new Set([a.school.adminPasscodeSalt,...a.students.map((s:any)=>s.pinSalt)]).size).toBe(5);expect(a.students[3].isHighSchoolFoundations).toBe(true);
  a.students[0].displayName='Changed';expect(b.students[0].displayName).toBe('Aya Cruz');
 });
 it('preserves leading-zero PINs through the real crypto boundary',async()=>{
  Object.defineProperty(globalThis,'crypto',{value:webcrypto,configurable:true});const salt=generateSalt(),hash=await hashPin('0012',salt);expect(await verifyPin('0012',hash,salt)).toBe(true);expect(await verifyPin('12',hash,salt)).toBe(false);expect(await verifyPin('1200',hash,salt)).toBe(false);
 });
});
