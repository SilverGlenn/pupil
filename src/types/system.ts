export type GradeLevel='preschool'|'elem_lower'|'elem_upper'|'highschool';
export type InterfaceMode='playful'|'guided'|'dashboard'|'studio';
export type ModuleKey='home'|'tech'|'simulators'|'english'|'typing'|'games';
export interface SchoolGroup {schoolCode:string;displayName:string;adminEmail:string;adminPasscodeHash:string;adminPasscodeSalt:string;createdAt:string;maxStudents:number;allowSelfRegistration?:boolean}
export interface StudentAccount {studentId:string;schoolCode:string;displayName:string;gradeLevel:GradeLevel;isHighSchoolFoundations:boolean;pinHash:string;pinSalt:string;avatarId:string;createdAt:string;lastLoginAt:string}
export interface StudentDraft {displayName:string;gradeLevel:GradeLevel;isHighSchoolFoundations:boolean;avatarId:string;pin?:string}
export interface RememberedStudentCard {studentId:string;schoolCode:string;displayName:string;gradeLevel:GradeLevel;isHighSchoolFoundations:boolean;avatarId:string;lastLoginAt:string}
export interface RememberedBrowserState {activeSchoolCode:string|null;savedAccounts:RememberedStudentCard[];deviceNickname?:string;soundEnabled:boolean;slowSpeechEnabled:boolean;highContrastMode:boolean}
export interface InitialRoster {school:SchoolGroup;students:StudentAccount[]}
export interface UserProgress {
 studentId:string;completedLessons:string[];
 typingProgress:{unlockedStage:number;completedDrills:Record<string,{accuracy:number;wpm?:number;completedAt:string;starsEarned:number}>};
 gameScores:{jeepneyWordExpress:{highScore:number;starsTotal:number;roundsCompleted:number};mangoCatcher:{highScore:number;maxStreak:number;roundsCompleted:number};sentenceBuilder:{solvedSentences:string[];starsTotal:number};techDetective:{solvedMissions:string[];badgesEarned:string[]}};
 totalPoints:number;currentStreakDays:number;lastActiveDate:string;
}
export interface BrownoutSnapshot {studentId:string;stage:InterfaceMode;moduleKey:ModuleKey;lessonId:string;charIndex:number;wpm:number;timestamp:number;slideIndex?:number;elapsedMs?:number;totalKeystrokes?:number;errors?:number;state?:Record<string,unknown>}
export interface OfflineMutation {id:string;studentId:string;progress:UserProgress;timestamp:number;attempts:number}
