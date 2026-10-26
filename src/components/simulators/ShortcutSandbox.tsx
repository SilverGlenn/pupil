import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import type {SimulatorProps} from '../../types/simulators';
import {useProgress} from '../../context/ProgressContext';
import {playChime} from '../../utils/audioSynth';

// The article and citation come from curriculum §4.4's document wireframe.
const paragraph='The Tubbataha Reefs Natural Park is located in the Sulu Sea.\nIt is home to over 600 species of fish and 360 coral species.\n';
const research='Research notes: Life of Jose Rizal.\n\nResearch notes: Katipunan.\n\nResearch notes: Barangay.';
const findDocument=Array.from({length:10},(_,i)=>`Page ${i+1}\n${paragraph}Index term: ${i<6?'Philipines':i===6?'Barangay':'Reference Sources'}`).join('\n\n');
const entries=['Source: UNESCO World Heritage Centre (2024)','DepEd Learning Portal','National Museum Virtual Tour'];
const bibliography=`${paragraph}\nReference Sources:\n`;
const relayDocument=entries.map(entry=>entry+'\n').join('')+'\n'+bibliography;
const relayResult='\n'+bibliography+entries.map(entry=>entry+'\n').join('');
const titles=['Duplicate a school paragraph','Undo Save','Find & Replace','Clipboard Relay','Save the finished document'];
const instructions=[
 'Select the complete school paragraph. Copy it with Ctrl+C, move to the end, and paste with Ctrl+V. The result must contain two complete copies.',
 'A digital character accidentally deletes three paragraphs of history research. Press Ctrl+Z within 5 seconds to undo the deletion and save the day.',
 'Find the word "Barangay" inside a simulated document using Ctrl+F. Then find all 6 occurrences of "Philipines" in the 10-page practice document and fix them.',
 'Cut the highlighted citation and paste it under Reference Sources at the bottom. Move all three misplaced bibliography entries in their original order. Select each complete line, including its line break.',
 'Press Ctrl+S to save the finished bibliography. All previous challenges must be accurately completed.'
];
type Revision={text:string;start:number;end:number;cause:'edit'|'accidental'};
export function ShortcutSandbox({onComplete}:SimulatorProps={}){
 const {markLessonComplete}=useProgress();const [phase,setPhase]=useState(0);const [text,setText]=useState(paragraph);const [clipboard,setClipboard]=useState('');const [findOpen,setFindOpen]=useState(false);const [query,setQuery]=useState('');const [feedback,setFeedback]=useState('');const [combo,setCombo]=useState('');const [passed,setPassed]=useState(false);const [finished,setFinished]=useState(false);const [deletion,setDeletion]=useState<'ready'|'active'|'expired'|'restored'>('ready');const [remaining,setRemaining]=useState(5);const [moved,setMoved]=useState<string[]>([]);
 const editor=useRef<HTMLTextAreaElement>(null);const search=useRef<HTMLInputElement>(null);const selection=useRef({start:0,end:0});const pendingSelection=useRef<{start:number;end:number}|null>(null);const undo=useRef<Revision[]>([]);const redo=useRef<Revision[]>([]);const fullCopy=useRef(false);const found=useRef({barangay:false,typos:false});const cut=useRef<{entry:string;after:string}|null>(null);const deadline=useRef(0);const timer=useRef<ReturnType<typeof setInterval>>();const awarded=useRef(false);
 useEffect(()=>()=>clearInterval(timer.current),[]);
 useLayoutEffect(()=>{const wanted=pendingSelection.current;if(wanted){editor.current?.focus();editor.current?.setSelectionRange(wanted.start,wanted.end);pendingSelection.current=null}},[text]);
 useEffect(()=>{if(findOpen)search.current?.focus()},[findOpen]);
 function select(start:number,end=start){selection.current={start,end};editor.current?.focus();editor.current?.setSelectionRange(start,end)}
 function restore(value:string,start:number,end=start){selection.current={start,end};pendingSelection.current={start,end};setText(value);if(value===text){select(start,end);pendingSelection.current=null}}
 function edit(value:string,start:number,end=start,cause:Revision['cause']='edit'){undo.current.push({text,...selection.current,cause});redo.current=[];restore(value,start,end);setPassed(false)}
 function reset(next=phase){clearInterval(timer.current);setPhase(next);setPassed(false);setFindOpen(false);setQuery('');setClipboard('');setFeedback('');setDeletion('ready');setRemaining(5);setMoved([]);fullCopy.current=false;found.current={barangay:false,typos:false};cut.current=null;undo.current=[];redo.current=[];restore([paragraph,research,findDocument,relayDocument,relayResult][next],0)}
 function accident(){clearInterval(timer.current);undo.current=[];redo.current=[];restore(research,0);undo.current.push({text:research,start:0,end:0,cause:'accidental'});setText('');selection.current={start:0,end:0};pendingSelection.current={start:0,end:0};deadline.current=Date.now()+5000;setDeletion('active');setRemaining(5);setPassed(false);setFeedback('Three research paragraphs were accidentally deleted. Undo within 5 seconds.');timer.current=setInterval(()=>{const left=Math.max(0,Math.ceil((deadline.current-Date.now())/1000));setRemaining(left);if(left===0){clearInterval(timer.current);setDeletion('expired');setPassed(false);setFeedback('The recovery window ended. Retry the deletion recovery safely.')}},100)}
 function command(key:string){if(finished)return;setCombo(`Ctrl + ${key.toUpperCase()}`);const {start,end}=selection.current;const chosen=text.slice(start,end);
  if(key==='a'){select(0,text.length);setFeedback('All document text selected.');return}
  if(key==='c'||key==='x'){
   if(!chosen){setFeedback('Select text in the document first.');return}
   setClipboard(chosen);fullCopy.current=key==='c'&&phase===0&&text===paragraph&&start===0&&end===paragraph.length;
   if(key==='x'){
    const entry=entries.find(entry=>chosen===entry+'\n');const after=text.slice(0,start)+text.slice(end);
    cut.current=phase===3&&entry&&!moved.includes(entry)&&start<text.indexOf('Reference Sources:')?{entry,after}:null;
    edit(after,start);
   }
   setFeedback(key==='c'?(fullCopy.current?'Complete paragraph copied. Move the cursor to the end.':'Text copied. This challenge needs the complete original paragraph.'):'Selected text cut to the local clipboard.');return;
  }
  if(key==='v'){
   if(!clipboard){setFeedback('Copy or cut some text first.');return}
   const value=text.slice(0,start)+clipboard+text.slice(end);const duplicate=phase===0&&fullCopy.current&&text===paragraph&&clipboard===paragraph&&start===end&&start===paragraph.length;
   const move=phase===3&&cut.current&&cut.current.after===text&&clipboard===cut.current.entry+'\n'&&start===end&&start===text.length;
   const entry=move?cut.current!.entry:null;edit(value,start+clipboard.length);cut.current=null;
   if(duplicate&&value===paragraph+paragraph){setPassed(true);setFeedback('Complete paragraph duplicated at the end.');playChime()}
   else if(entry){const next=[...moved,entry];setMoved(next);setPassed(next.length===3&&value===relayResult);setFeedback('Citation moved under Reference Sources.');playChime()}
   else setFeedback('Text pasted, but the challenge location or selection is not correct. Undo or reset the challenge.');return;
  }
  if(key==='z'||key==='y'){
   const stack=key==='z'?undo.current:redo.current;const revision=stack.pop();if(!revision){setFeedback('Make an edit before using Undo or Redo.');return}
   (key==='z'?redo.current:undo.current).push({text,start,end,cause:'edit'});restore(revision.text,revision.start,revision.end);setPassed(false);
   if(key==='z'&&phase===1&&revision.cause==='accidental'&&deletion==='active'&&Date.now()<deadline.current&&revision.text===research){clearInterval(timer.current);setDeletion('restored');setPassed(true);setFeedback('All three deleted paragraphs recovered within 5 seconds.');playChime()}
   else setFeedback('Edit restored. This is not the required timed deletion recovery.');return;
  }
  if(key==='f'){setFindOpen(true);search.current?.focus();setFeedback('Find the exact challenge words in this document.');return}
  if(key==='s'){
   setFeedback('Work saved locally in this practice session.');playChime();
   if(phase===4&&text===relayResult&&!awarded.current){awarded.current=true;setFinished(true);markLessonComplete('sim-shortcuts');onComplete?.()}
   return;
  }
 }
 function find(value:string){setQuery(value);if(phase!==2)return;const matches=value?text.split(value).length-1:0;if(value==='Barangay'&&matches===1)found.current.barangay=true;if(value==='Philipines'&&matches===6&&text===findDocument)found.current.typos=true;setPassed(false)}
 const matches=query?text.split(query):[text];
 return <section className="card stack" onKeyDown={e=>{const key=e.key.toLowerCase();if(e.target!==editor.current&&!['f','s'].includes(key))return;if((e.ctrlKey||e.metaKey)&&['a','c','x','v','z','y','f','s'].includes(key)){e.preventDefault();if(e.target===editor.current)selection.current={start:editor.current?.selectionStart??0,end:editor.current?.selectionEnd??0};command(key)}}}>
 <h2>Keyboard Shortcut Sandbox</h2><h3>Challenge {phase+1} / 5: {titles[phase]}</h3><p>{instructions[phase]}</p><div className="workspace"><div className="stack"><label>Document editor<textarea className="editor" ref={editor} value={text} rows={12} onSelect={e=>{selection.current={start:e.currentTarget.selectionStart,end:e.currentTarget.selectionEnd}}} onChange={e=>{undo.current.push({text,...selection.current,cause:'edit'});redo.current=[];setText(e.target.value);selection.current={start:e.target.selectionStart,end:e.target.selectionEnd};cut.current=null;setPassed(false)}}/></label>
 <div className="toolbar" aria-label="Touch shortcut toolbar">{[['a','Select all'],['c','Copy'],['x','Cut'],['v','Paste'],['z','Undo'],['y','Redo'],['f','Find'],['s','Save']].map(([key,label])=><button key={key} onPointerDown={e=>e.preventDefault()} onClick={()=>command(key)}>{label}</button>)}</div><div className="row"><button onClick={()=>select(text.length)}>Move cursor to document end</button>{phase===3&&entries.filter(entry=>!moved.includes(entry)&&text.indexOf(entry)<text.indexOf('Reference Sources:')).map((entry,i)=><button key={entry} onClick={()=>{const start=text.indexOf(entry);select(start,start+entry.length+1)}}>Select citation {i+1}</button>)}</div>
 </div><aside className="panel"><h3>Mission tracker</h3>{titles.map((title,i)=><p key={title}>{phase>i||finished?'✓':phase===i?'→':'○'} {title}</p>)}<p>Keys: {combo||'None yet'}</p><p>Clipboard: {clipboard||'Empty (local practice only)'}</p>{phase===3&&<p>{moved.length} / 3 citations moved</p>}</aside></div>
 {phase===2&&<details className="panel"><summary>View 10 practice pages</summary><div style={{maxHeight:480,overflowY:'auto'}}>{text.split('\n\n').map((page,i)=><section aria-label={`Practice page ${i+1}`} key={i} style={{minHeight:240,padding:24,marginBottom:16,border:'2px solid var(--color-border)',whiteSpace:'pre-wrap'}}><h4>Page {i+1}</h4><p>{page.slice(page.indexOf('\n')+1)}</p></section>)}</div></details>}
 {phase===1&&<div className="panel">{deletion==='ready'?<button onClick={accident}>Simulate accidental deletion</button>:deletion==='expired'?<button onClick={accident}>Retry deletion recovery</button>:<p>{deletion==='restored'?'Research recovered.':`Undo within ${remaining} seconds.`}</p>}</div>}
 {findOpen&&<div className="panel"><label>Find text<input ref={search} value={query} onChange={e=>find(e.target.value)}/></label><p>{query?matches.length-1:0} exact matches</p><p aria-label="Search results" style={{whiteSpace:'pre-wrap'}}>{matches.map((part,i)=><span key={i}>{i>0&&<mark>{query}</mark>}{part}</span>)}</p>{phase===2&&<button onClick={()=>{if(!found.current.barangay||!found.current.typos||query!=='Philipines'||text!==findDocument){setFeedback('Find Barangay and all 6 exact Philipines matches first.');return}edit(text.split('Philipines').join('Philippines'),0);setPassed(true);setFeedback('All 6 occurrences corrected to Philippines.');playChime()}}>Replace all with Philippines</button>}</div>}
 {passed&&phase<4&&<button onClick={()=>reset(phase+1)}>Next challenge</button>}{!finished&&<button onClick={()=>reset()}>Reset current challenge</button>}<p role="status">{feedback}</p>{finished&&<p>Shortcut practice complete.</p>}</section>
}
export default ShortcutSandbox;
