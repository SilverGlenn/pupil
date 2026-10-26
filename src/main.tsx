import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {SettingsProvider} from './context/SettingsContext';
import {AuthProvider} from './context/AuthContext';
import {StageThemeProvider} from './context/StageThemeContext';
import {ProgressProvider} from './context/ProgressContext';
import {createInitialRoster} from './data/initialRoster';
import App,{ModuleBoundary} from './App';
import './index.css';
const root=document.getElementById('root');
if(!root)throw new Error('The application mount point is missing.');
createRoot(root).render(<StrictMode><ModuleBoundary onHome={()=>{window.location.hash='home';window.location.reload()}}><SettingsProvider><AuthProvider initialRoster={createInitialRoster}><StageThemeProvider><ProgressProvider><App/></ProgressProvider></StageThemeProvider></AuthProvider></SettingsProvider></ModuleBoundary></StrictMode>);
if(import.meta.env.PROD&&'serviceWorker' in navigator){window.addEventListener('load',()=>{void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(()=>{window.dispatchEvent(new CustomEvent('pupil-offline-warning'))})},{once:true})}
