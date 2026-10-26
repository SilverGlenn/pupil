import {createContext,useContext,useState,useEffect,type ReactNode} from 'react';
import {readStored,writeStored} from '../utils/storageEngine';
import {setAudioEnabled} from '../utils/audioSynth';
import {configureSpeech} from '../utils/speechTts';
export interface Settings {soundEnabled:boolean;speechEnabled:boolean;slowSpeechEnabled:boolean;highContrastMode:boolean;showWpm:boolean}
const defaults:Settings={soundEnabled:true,speechEnabled:true,slowSpeechEnabled:false,highContrastMode:false,showWpm:false};
const Context=createContext<{settings:Settings;updateSettings:(patch:Partial<Settings>)=>void}|null>(null);
export function SettingsProvider({children}:{children:ReactNode}) {const [settings,setSettings]=useState<Settings>(()=>({...defaults,...readStored<Partial<Settings>>('pupil_settings',{})}));useEffect(()=>{writeStored('pupil_settings',settings);setAudioEnabled(settings.soundEnabled);configureSpeech(settings.speechEnabled,settings.slowSpeechEnabled);document.documentElement.dataset.contrast=settings.highContrastMode?'high':'normal'},[settings]);return <Context.Provider value={{settings,updateSettings:patch=>setSettings(s=>({...s,...patch}))}}>{children}</Context.Provider>}
export function useSettings(){const c=useContext(Context);if(!c)throw new Error('SettingsProvider is required.');return c}
