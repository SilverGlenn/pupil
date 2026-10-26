import {it,expect,vi} from 'vitest';
import {speakText,stopSpeech,configureSpeech} from '../src/utils/speechTts';
it('unavailable speech exposed as undefined never crashes navigation or login and supplies readable fallback',()=>{
 vi.stubGlobal('speechSynthesis',undefined);let fallback='';let word=99;configureSpeech(true,false);
 try{expect(()=>stopSpeech()).not.toThrow();expect(speakText('Save your file now',{onFallback:text=>fallback=text,onWord:index=>word=index})).toBe(false);expect(fallback).toBe('Save your file now');expect(word).toBe(-1)}finally{vi.unstubAllGlobals()}
});
