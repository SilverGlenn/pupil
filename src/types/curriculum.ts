import type {GradeLevel} from './system';
export type CurriculumTrack='level_1'|'level_2'|'level_3'|'track_4a'|'track_4b';
export interface Slide {slideId:string;headline:string;bodyText:string;illustrationKey:string;ttsAudioText:string;visualDescription?:string}
export interface QuizQuestion {questionId:string;questionText:string;ttsAudioText:string;options:string[];correctIndex:number;explanation:string;incorrectExplanation?:string;optionFeedback?:string[]}
export interface Lesson {lessonId:string;level:GradeLevel;title:string;category:'tech_literacy'|'basic_english';isFoundationBridge?:boolean;moduleId:string;moduleTitle:string;summary:string;slides:Slide[];quiz:QuizQuestion[];realLifeTip?:string;voiceoverScript?:string;visualDescription?:string}
export interface VocabCard {id:string;level:CurriculumTrack;term:string;category:{partOfSpeech:'noun'|'verb'|'adjective'|'noun_phrase'|'adverb';theme:string};definition:string;exampleSentence:string;visualAsset:{iconId:string;altText:string;designPrompt:string};audioGuide:{syllabification:string;phoneticSpelling:string;audioFilePath?:string}}
export interface SentenceExercise {id:string;level:CurriculumTrack;grammarSkill:string;promptInstruction:string;targetTiles:string[];distractorTiles:string[];targetSentence:string;contextHint:{visualDescription:string;audioPromptPath?:string}}
export type SentenceBuilderExercise=SentenceExercise;
export interface StoryQuizOption {key:'A'|'B'|'C'|'D';text:string;isCorrect:boolean;feedback:string}
export interface StoryPassage {id:string;level:CurriculumTrack;title:string;metadata:{wordCount:number;targetLexile:string;coreVocabulary:string[]};paragraphs:string[];audioNarrationPath?:string;quiz:{questionId:string;questionText:string;options:StoryQuizOption[]}[]}
export type ReadingPassage=StoryPassage;
