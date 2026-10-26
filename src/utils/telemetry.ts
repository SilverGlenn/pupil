export function computeAccuracy(correct:number,total:number):number {return total>0?Math.min(100,Math.max(0,correct/total*100)):100}
export function computeWpm(totalCharacters:number,elapsedMs:number):number {return elapsedMs>0?Math.max(0,totalCharacters/5/(elapsedMs/60000)):0}
export function computeNetWpm(totalCharacters:number,uncorrectedErrors:number,elapsedMs:number):number {return elapsedMs>0?Math.max(0,computeWpm(totalCharacters,elapsedMs)-uncorrectedErrors/(elapsedMs/60000)):0}
export function updateStreak(streak:number,correct:boolean):number {return correct?streak+1:0}
export function starsForAccuracy(accuracy:number):number {return accuracy>=95?3:accuracy>=85?2:1}
