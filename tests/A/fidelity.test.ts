import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {techLessons} from '../../src/data/techLessons';
import {vocabCards,vocabSourceNotes} from '../../src/data/englishVocab';
import {sentenceExercises} from '../../src/data/englishSentences';
import {storyPassages} from '../../src/data/englishStories';
import {typingDrills} from '../../src/data/typingDrills';
import {jeepneyWordBank,sentenceScrambleBank,scamDatabase,detectiveFileBank} from '../../src/data/gameData';
const en=readFileSync('curriculum/02-basic-english-curriculum.md','utf8');
const tg=readFileSync('curriculum/03-typing-and-games-spec.md','utf8');
const tech=readFileSync('curriculum/01-tech-literacy-curriculum.md','utf8');
const field=(s:string,label:string)=>s.split(`**${label}:** `)[1]?.split('\n')[0]??s.split(`**${label}**: `)[1]?.split('\n')[0];
const prose=(s:string)=>s.replace(/`|\*\*/g,'').replace(/\*(.*?)\*/g,'$1').trim();
it('preserves all 30 sentence inputs, distractors, grammar and hints from the source',()=>{
 const sections=[...en.matchAll(/#### Exercise (\S+): [^\n]+\n([\s\S]*?)(?=\n#### |\n---)/g)];expect(sections).toHaveLength(30);
 for(const [i,m] of sections.entries()){
  const s=sentenceExercises[i];expect(s.id).toBe(m[1]);
  expect(s.grammarSkill).toBe(field(m[2],'Grammar Skill'));expect(s.promptInstruction).toBe(field(m[2],'Prompt Instruction'));
  expect(s.targetTiles).toEqual(JSON.parse(field(m[2],'Ordered Target Word Tiles').slice(1,-1)));
  expect(s.distractorTiles).toEqual(JSON.parse(field(m[2],'Distractor Word Tiles').slice(1,-1)));
  expect(s.targetSentence).toBe(field(m[2],'Completed Target Sentence'));expect(s.contextHint.visualDescription).toBe(field(m[2],'Visual / Audio Context Hint'));
 }
});
it('preserves all passage paragraphs, metadata, questions and each option/feedback pair',()=>{
 const sections=[...en.matchAll(/#### Passage (\S+): ([^\n]+)\n([\s\S]*?)(?=\n#### |\n---)/g)];expect(sections).toHaveLength(13);
 for(const [i,m] of sections.entries()){
  const s=storyPassages[i],body=m[3];expect(s.id).toBe(m[1]);expect(s.title).toBe(m[2]);
  expect(s.metadata).toEqual({wordCount:Number(field(body,'Word Count').split(' ')[0]),targetLexile:field(body,'Lexile / Readability Target'),coreVocabulary:field(body,'Core Vocabulary').split(', ')});
  expect(s.paragraphs.join('\n\n')).toBe(body.split('**Story Text:**\n\n')[1].split('\n\n**Comprehension Quiz:**')[0]);
  const questions=[...body.matchAll(/\*\*Question \d+:\*\* ([^\n]+)\n([\s\S]*?)(?=\n\*\*Question|$)/g)];expect(questions).toHaveLength(3);
  for(const [j,q] of questions.entries()){
   expect(s.quiz[j].questionText).toBe(q[1]);
   const options=[...q[2].matchAll(/- ([A-D])\. ([^\n]+)\n  - \*Feedback:\* ([^\n]+)/g)];
   expect(s.quiz[j].options).toEqual(options.map(o=>({key:o[1],text:o[2].replace(' *(Correct)*',''),isCorrect:o[2].includes('*(Correct)*'),feedback:o[3]})));
  }
 }
});
it('retains source category alternatives and full pronunciation notes without fabricated audio paths',()=>{
 const sections=[...en.matchAll(/#### Card (\S+): [^\n]+\n([\s\S]*?)(?=\n#### |\n---)/g)];expect(sections).toHaveLength(75);
 for(const [i,m] of sections.entries()){
  expect(vocabSourceNotes[m[1]]).toEqual({category:field(m[2],'Category'),pronunciationGuide:field(m[2],'Audio Pronunciation Guide')});
  expect(vocabCards[i].audioGuide.audioFilePath).toBeUndefined();
  expect(vocabCards[i].audioGuide.phoneticSpelling).toBe(prose(field(m[2],'Audio Pronunciation Guide').split('[').slice(1).join('[').replace(/^/,'[')));
 }
});
it('retains every articulated drill field, not just target text',()=>{
 const sections=[...tg.matchAll(/#### Drill (\d+)\.\d+: [^\n]+\n([\s\S]*?)(?=\n#### Drill|\n---)/g)];expect(sections).toHaveLength(60);
 for(const [i,m] of sections.entries()){
  const d=typingDrills[i];expect(d.stageNumber).toBe(Number(m[1]));
  for(const key of ['title','pedagogicalGoal','promptInstruction','ttsPrompt'] as const)expect(d[key]).toBe(field(m[2],key));
  expect(d.focusKeys).toEqual(JSON.parse(field(m[2],'focusKeys').slice(1,-1)));
 }
});
it('retains every tech assessment and real-life tip with correct index semantics',()=>{
 const sections=[...tech.matchAll(/#### Lesson ([\w.]+): [^\n]+\n([\s\S]*?)(?=\n#### Lesson|\n### Module|\n## 4\.)/g)];expect(sections).toHaveLength(35);
 for(const [i,m] of sections.entries()){
  const l=techLessons[i],body=m[2],q=l.quiz[0];expect(l.summary).toBe(prose(field(body,'Target Competency')));
  expect(q.questionText).toBe(prose(field(body,'Question')));expect(q.ttsAudioText).toBe(q.questionText);
  expect(q.correctIndex).toBe('ABCD'.indexOf(field(body,'Correct Answer')));
  expect(q.options).toEqual([...body.matchAll(/^    - [A-D]\) (.*)$/gm)].map(o=>prose(o[1].replace(' *(Correct)*',''))));
  expect(q.explanation).toBe(prose(field(body,'Feedback (Correct)').slice(1,-1)));
  expect(q.incorrectExplanation).toBe(prose(field(body,'Feedback (Incorrect)').slice(1,-1)));
  expect(l.realLifeTip).toBe(prose(body.split('**Real-Life Philippine Tip:**\n  > ')[1].split('\n')[0]));
  const visual=body.split('**Visual & Art Direction:**\n')[1].split('- **Step-by-Step Lesson Script:**')[0].trim().split('\n').map(line=>prose(line.replace(/^\s*- /,''))).join('\n');
  expect(l.visualDescription).toBe(visual);for(const slide of l.slides)expect(slide.visualDescription).toBe(visual);
 }
});
it('preserves all supplied game table cells including awkward source puzzle wording',()=>{
 const jeep=tg.split('\n').filter(l=>l.startsWith('| `jep-'));expect(jeep).toHaveLength(15);
 for(const [i,line] of jeep.entries()){
  const cells=line.slice(1,-1).split('|').map(prose);const item=jeepneyWordBank[i];
  expect(new Set([item.correctImage,...item.distractors]).size).toBe(1+item.distractors.length);
  expect(item).toEqual({id:cells[0],tier:Number(cells[1].slice(-1)),targetWord:cells[2],category:cells[3],correctImage:cells[4],distractors:cells.slice(5).filter(x=>x!=='—')});
 }
 const scrambles=tg.split('\n').filter(l=>l.startsWith('| `sb-'));expect(scrambles).toHaveLength(20);
 for(const [i,line] of scrambles.entries()){
  const c=line.slice(1,-1).split('|').map(prose),s=sentenceScrambleBank[i];expect(s.scrambledWords).toEqual(JSON.parse(c[1]));expect(s.correctSentence).toBe(c[2]);expect(s.grammarFocus).toBe(c[3]);expect(s.ttsAudioScript).toBe(c[4].slice(1,-1));
  const tokens=(words:string[])=>words.map(w=>w.replace(/[.?]$/,'')).sort();expect(tokens(s.scrambledWords)).toEqual(tokens(s.correctSentence.split(' ')));
 }
 expect(sentenceScrambleBank[16].correctSentence).toBe('Save your file with the name name_science.pdf project.');
 expect(detectiveFileBank.map(f=>f.name)).toEqual(['philippine_eagle.png','science_plants.docx','national_anthem.mp3','math_quiz_scores.xlsx','class_field_trip.jpg','corregidor_history.pdf']);
});
it('keeps all nine detailed scenario messages and explanations exactly',()=>{
 const techCases=[...tech.matchAll(/\d\. \*\*Case \d \([^\n]+\n([\s\S]*?)(?=\n\d\. \*\*Case|\n####)/g)];expect(techCases).toHaveLength(5);
 for(const [i,m] of techCases.entries()){
  const c=scamDatabase[i];expect(c.messageBody).toBe(m[1].split('*Message:* "')[1].split('"\n')[0]);expect(c.explanationFeedback).toBe(m[1].split('*Explanation:* ')[1].split('\n')[0]);expect(c.isScam).toBe(m[1].includes('**SCAM**'));
 }
 const gameCases=[...tg.matchAll(/#### Scenario C\.\d: [^\n]+\n([\s\S]*?)(?=\n#### Scenario|\n---)/g)];expect(gameCases).toHaveLength(4);
 for(const [i,m] of gameCases.entries()){
  const c=scamDatabase[i+5];expect(c.messageBody).toBe(m[1].match(/\*(?:Text|Message)\*: `"(.*)"`/)![1]);expect(c.explanationFeedback).toBe(m[1].split('**Detective Explanation**: ')[1].split('\n')[0]);
 }
});
