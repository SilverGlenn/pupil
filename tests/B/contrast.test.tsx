import {it,expect} from 'vitest';
import {render,screen,fireEvent} from '@testing-library/react';
import {readFileSync} from 'node:fs';
import {chromium} from '@playwright/test';
import {AuthProvider,useAuth} from '../../src/context/AuthContext';
import {SettingsProvider} from '../../src/context/SettingsContext';
import {StageThemeProvider} from '../../src/context/StageThemeContext';
import {ProgressProvider} from '../../src/context/ProgressContext';
import {StageContainer} from '../../src/components/layout/StageContainer';
import {Header} from '../../src/components/layout/Header';
import {createInitialRoster} from '../../src/data/initialRoster';
import {saveSchools,saveStudents,saveActiveSchool} from '../../src/utils/storageEngine';
function Navigation({id,pin}:{id:string;pin:string}){const a=useAuth();return <StageContainer>{a.activeStudent?<Header current="home" onNavigate={()=>{}}/>:a.ready?<button onClick={()=>void a.loginStudent(id,pin)}>Enter navigation</button>:null}</StageContainer>}
function luminance(rgb:string){const channels=rgb.match(/\d+/g)!.slice(0,3).map(Number).map(c=>{const s=c/255;return s<=0.04045?s/12.92:((s+0.055)/1.055)**2.4});return channels[0]*0.2126+channels[1]*0.7152+channels[2]*0.0722}
// Host authorized this focused preprovisioned-browser check only; normal runs leave it opt-in.
it.skipIf(process.env.B_BROWSER_CHECK!=='1')('keeps actual selected navigation readable in all four browser-computed palettes',async()=>{
 const executablePath=process.env.B_CHROMIUM_PATH??chromium.executablePath();
 console.log('B contrast browser:',executablePath);
 const browser=await chromium.launch({executablePath,headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.route('**/*',route=>route.abort());
  const css=readFileSync('src/index.css','utf8');
  const seed=await createInitialRoster();saveSchools([seed.school]);saveStudents(seed.students);saveActiveSchool(seed.school.schoolCode);
  const ratios:number[]=[];
  for(const [index,stage,minHeight] of [[0,'playful',80],[1,'guided',56],[2,'dashboard',44],[3,'studio',40]] as const){
   const student=seed.students[index];
   const view=render(<SettingsProvider><AuthProvider><StageThemeProvider><ProgressProvider><Navigation id={student.studentId} pin={String(index+1).repeat(4)}/></ProgressProvider></StageThemeProvider></AuthProvider></SettingsProvider>);
   fireEvent.click(await screen.findByText('Enter navigation'));
   await screen.findByRole('navigation');
   const root=document.querySelector('#app-root')!;
   expect(root.getAttribute('data-stage')).toBe(stage);
   for(const contrast of ['normal','high']){
    await page.setContent(`<html data-contrast="${contrast}"><head><style>${css}</style></head><body>${root.outerHTML}</body></html>`);
    const computed=await page.locator('nav button[aria-current=page]').evaluate(button=>{const c=getComputedStyle(button);return {foreground:c.color,background:c.backgroundColor,minHeight:parseFloat(c.minHeight),font:c.fontFamily}});
    const a=luminance(computed.foreground),b=luminance(computed.background);const ratio=(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);ratios.push(ratio);
    console.log(JSON.stringify({stage,contrast,...computed,ratio:Number(ratio.toFixed(3))}));
    expect(computed.minHeight).toBe(minHeight);
    expect(computed.font).toContain(stage==='studio'?'JetBrains Mono':'Lexend');
    if(stage==='playful'){expect(computed.foreground).toBe('rgb(30, 41, 59)');expect(computed.background).toBe('rgb(245, 158, 11)')}
   }
   view.unmount();
  }
  expect(ratios.every(ratio=>ratio>=4.5)).toBe(true);
 }finally{await browser.close()}
},20000);
