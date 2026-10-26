export type SimulatorId='tap'|'mouse'|'files'|'shortcuts'|'scam';
export interface SimulatorStep {id:string;instruction:string;complete:boolean}
export interface TapTarget {id:string;x:number;y:number;radius:number;kind:'butterfly'|'fish'|'target'}
export interface FileItem {id:string;name:string;extension:string;correctFolderId:string;currentFolderId:string;isSaved:boolean;lastSavedTimestamp:number}
export type VirtualFileItem=FileItem;
export interface ShortcutAction {key:string;label:string;description:string}
export interface ScamScenario {id:string;senderDisplay:string;senderRaw:string;messageType:'SMS'|'EMAIL'|'MESSENGER';messageBody:string;inspectionClues:{senderClue:string;urlClue:string;urgencyClue:string};isScam:boolean;explanationFeedback:string;redFlagsList:string[]}
export type ScamCaseScenario=ScamScenario;
export interface SimulatorProps {onComplete?:()=>void}
