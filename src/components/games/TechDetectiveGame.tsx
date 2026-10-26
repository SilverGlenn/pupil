import {useRef,useState} from 'react';
import {detectiveFileBank,scamDatabase} from '../../data/gameData';
import {useGameSession} from './GamesModule';
import {ConceptArt} from '../english/VocabCardViewer';
import {speakText} from '../../utils/speechTts';
import {playChime,playWoodenTap} from '../../utils/audioSynth';

export function TechDetectiveGame(){
 const game=useGameSession('tech_detective',{done:false,mission:'targets',targets:[] as number[],opened:false,usbEjected:false,sorted:[] as string[],caseIndex:0,ids:[] as string[],score:0});
 const {state,current,update,finish,blocked,stage}=game;
 const [selected,setSelected]=useState('');const [feedback,setFeedback]=useState('');const lastTap=useRef(0);
 const dock=useRef<HTMLButtonElement>(null);const nativeUsbDrag=useRef(false);
 const pointerDrag=useRef<{id:number;x:number;y:number}|null>(null);
 const [dragOffset,setDragOffset]=useState<{x:number;y:number}|null>(null);
 const scenario=scamDatabase[state.caseIndex];const folders=[...new Set(detectiveFileBank.map(f=>f.correctFolderId))];
 // Older saved sorting/safety sessions must also perform the newly required task.
 const mission=state.opened&&!state.usbEjected?'usb':state.mission;
 const tap=(id:number)=>{if(blocked||state.targets.includes(id))return;playChime();update({...state,targets:[...state.targets,id]})};
 const open=()=>{if(blocked||state.targets.length<3||state.opened)return;playChime();update({...state,opened:true,mission:'usb',ids:['target-practice'],score:100});setFeedback('Document opened. Drag the USB drive to the eject dock.')};
 const eject=()=>{const s=current.current;if(blocked||!s.opened||s.usbEjected||s.done)return;playChime();update({...s,usbEjected:true,mission:s.mission==='usb'?'files':s.mission,ids:[...s.ids,'usb-ejection'],score:s.score+50});setFeedback('USB safely ejected. Now sort the files.')};
 const sort=(fileId:string,folder:string)=>{if(blocked||!state.usbEjected||mission!=='files')return;const file=detectiveFileBank.find(f=>f.id===fileId);if(!file||state.sorted.includes(file.id))return;if(file.correctFolderId!==folder){setFeedback('Look at the file ending. Try another folder.');playWoodenTap();return}const sorted=[...state.sorted,file.id];setSelected('');setFeedback('Correct folder.');playChime();update({...state,sorted,mission:sorted.length===detectiveFileBank.length?'safety':'files',ids:sorted.length===detectiveFileBank.length?[...state.ids,'file-sorting']:state.ids,score:state.score+25})};
 const decide=(scam:boolean)=>{if(blocked||!scenario||state.done||!state.usbEjected||mission!=='safety'||state.sorted.length!==detectiveFileBank.length)return;setFeedback(scenario.explanationFeedback);if(scam!==scenario.isScam){playWoodenTap();return}playChime();const next={...state,caseIndex:state.caseIndex+1,ids:[...state.ids,scenario.id],score:state.score+100};if(next.caseIndex===scamDatabase.length)finish(next,next.score,next.ids);else update(next)};
 return <section className={`game-arena ${stage==='studio'?'studio':''} stack`} data-stage={stage}>
  <h2>Tech Detective</h2>
  <div className="mission-board"><p>Mission board: Target practice → USB ejection → File sorting → Safe or scam</p><p>Score: {state.score} · Missions solved: {state.ids.length}</p></div>
  {state.done?<p>All missions complete. Your badge and score are saved.</p>:mission==='targets'?<>
   <h3>Target practice</h3><p>Tap each target, then double-click or double-tap the document.</p>
   <div style={{minHeight:180,display:'flex',gap:24,alignItems:'center'}}>{[0,1,2].map(id=><button aria-label={`Tap target ${id+1}`} key={id} disabled={blocked||state.targets.includes(id)} style={{width:90,height:90,borderRadius:'50%',alignSelf:id%2?'flex-start':'flex-end'}} onClick={()=>tap(id)}><svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" strokeWidth="4"/><circle cx="30" cy="30" r="12" fill="currentColor"/></svg></button>)}</div>
   <button aria-label="Open document with a double click" disabled={blocked||state.targets.length<3} onDoubleClick={open} onPointerUp={e=>{if(e.pointerType==='touch'){const now=Date.now();if(lastTap.current&&now-lastTap.current<=450)open();lastTap.current=now}}}><ConceptArt concept="Document" studio={stage==='studio'}/>Double-click document</button>
  </>:mission==='usb'?<>
   <h3>Safely eject the USB drive</h3><p>Drag the USB drive across the desktop and release it inside the eject dock.</p>
   <div className="simulator-scene" style={{minHeight:250,display:'flex',alignItems:'center',justifyContent:'space-between',gap:32,padding:24}}>
    <button aria-label="USB drive" disabled={blocked} draggable style={{touchAction:'none',transform:dragOffset?`translate(${dragOffset.x}px,${dragOffset.y}px)`:undefined,zIndex:1,cursor:'grab'}}
     onDragStart={e=>{if(blocked){e.preventDefault();return}nativeUsbDrag.current=true;e.dataTransfer.setData('text/plain','detective-usb')}}
     onDragEnd={()=>{nativeUsbDrag.current=false;pointerDrag.current=null;setDragOffset(null)}}
     onPointerDown={e=>{if(blocked||e.pointerType==='mouse')return;e.preventDefault();pointerDrag.current={id:e.pointerId,x:e.clientX,y:e.clientY};setDragOffset({x:0,y:0});e.currentTarget.setPointerCapture?.(e.pointerId)}}
     onPointerMove={e=>{const start=pointerDrag.current;if(start?.id===e.pointerId)setDragOffset({x:e.clientX-start.x,y:e.clientY-start.y})}}
     onPointerCancel={()=>{pointerDrag.current=null;setDragOffset(null)}}
     onPointerUp={e=>{const start=pointerDrag.current;pointerDrag.current=null;setDragOffset(null);if(!start||start.id!==e.pointerId)return;const bounds=dock.current?.getBoundingClientRect();const moved=Math.hypot(e.clientX-start.x,e.clientY-start.y)>12;if(moved&&bounds&&e.clientX>=bounds.left&&e.clientX<=bounds.right&&e.clientY>=bounds.top&&e.clientY<=bounds.bottom)eject();else setFeedback('Keep dragging until the USB reaches the eject dock.')}}>
     <ConceptArt concept="USB flash drive" studio={stage==='studio'}/>USB drive
    </button>
    <button ref={dock} aria-label="Eject USB dock" disabled={blocked} className="drop-zone" style={{minWidth:140,minHeight:140}} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const valid=nativeUsbDrag.current&&e.dataTransfer.getData('text/plain')==='detective-usb';nativeUsbDrag.current=false;pointerDrag.current=null;setDragOffset(null);if(valid)eject();else setFeedback('Drag the USB drive into this dock.')}}>
     <svg viewBox="0 0 80 80" aria-hidden="true" style={{width:80,height:80}}><path d="M40 10L68 48H12ZM12 60H68V70H12Z" fill="currentColor"/></svg>Eject dock
    </button>
   </div>
  </>:mission==='files'?<>
   <h3>File sorting</h3><p>Choose a file, then its folder. You can also drag and drop.</p>
   <div className="file-grid">{detectiveFileBank.filter(f=>!state.sorted.includes(f.id)).map(file=><button className="file-item" key={file.id} disabled={blocked} aria-pressed={selected===file.id} draggable onDragStart={e=>{e.dataTransfer.setData('text/plain',file.id);setSelected(file.id)}} onClick={()=>setSelected(file.id)}>{file.name}</button>)}</div>
   <div className="row">{folders.map(folder=><button className="drop-zone" key={folder} disabled={blocked} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();sort(e.dataTransfer.getData('text/plain'),folder)}} onClick={()=>sort(selected,folder)}>{folder}</button>)}</div>
  </>:scenario?<>
   <h3>Safe or scam · Case {state.caseIndex+1}/{scamDatabase.length}</h3><div className="phone-frame"><p>From: {scenario.senderDisplay}</p><p>{scenario.senderRaw}</p><p>{scenario.messageBody}</p></div>
   <button onClick={()=>speakText(scenario.messageBody,{stage})}>Listen to message</button><details><summary>Inspect clues</summary><p>{scenario.inspectionClues.senderClue}</p><p>{scenario.inspectionClues.urlClue}</p><p>{scenario.inspectionClues.urgencyClue}</p></details><div className="actions"><button disabled={blocked} onClick={()=>decide(false)}>Safe message</button><button disabled={blocked} onClick={()=>decide(true)}>Scam message</button></div>
  </>:null}<p role="status">{feedback}</p>
 </section>
}
export default TechDetectiveGame;
