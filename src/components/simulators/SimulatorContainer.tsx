import {useState} from 'react';
import type {SimulatorId} from '../../types/simulators';
import {useProgress} from '../../context/ProgressContext';
import {ScreenTapTrainer} from './ScreenTapTrainer';
import {MouseActionTrainer} from './MouseActionTrainer';
import {FileFolderSorter} from './FileFolderSorter';
import {ShortcutSandbox} from './ShortcutSandbox';
import {SafeScamInspector} from './SafeScamInspector';
const entries=[{id:'tap',title:'Screen Tap & Gentle Target Trainer',component:ScreenTapTrainer},{id:'mouse',title:'Mouse & Touchpad Action Trainer',component:MouseActionTrainer},{id:'files',title:'Desktop File & Folder Sorter',component:FileFolderSorter},{id:'shortcuts',title:'Keyboard Shortcut Sandbox',component:ShortcutSandbox},{id:'scam',title:'Safe or Scam? Message Inspector',component:SafeScamInspector}] as const;
export function SimulatorContainer(){const [selected,setSelected]=useState<SimulatorId|null>(null);const {progress}=useProgress();const entry=entries.find(item=>item.id===selected);if(entry){const Simulator=entry.component;return <section className="module-page stack"><button onClick={()=>setSelected(null)}>Back to simulators</button><Simulator/></section>}return <section className="module-page stack"><header className="module-header"><div><p className="eyebrow">Hands-on practice</p><h1>Simulators</h1><p>Choose a practical skill to explore.</p></div></header><div className="card-grid">{entries.map(item=><article className="card stack" key={item.id}><h2>{item.title}</h2><p>{progress.completedLessons.includes(`sim-${item.id}`)?'Completed':'Ready to practice'}</p><button onClick={()=>setSelected(item.id)}>{item.title}</button></article>)}</div></section>}
export default SimulatorContainer;
