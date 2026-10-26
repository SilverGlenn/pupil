import type {CurriculumTrack} from './curriculum';
export type GameId='jeepney_word_express'|'mango_catcher'|'sentence_scramble'|'tech_detective';
export interface JeepneyWordItem {id:string;tier:number;targetWord:string;category:string;correctImage:string;distractors:string[]}
export interface FallingKeyItem {id:string;key:string;x:number;spawnedAt:number;durationMs:number}
export interface ScrambleItem {id:string;level:CurriculumTrack;scrambledWords:string[];correctSentence:string;grammarFocus:string;ttsAudioScript:string}
export interface GameResult {gameId:GameId;studentId:string;timestamp:string;score:number;accuracyPercentage?:number;streakAchieved?:number;starsAwarded:number;isNewPersonalBest:boolean;completedIds?:string[]}
export interface ArcadeScore {gameId:GameId;highScore:number;starsTotal:number}
