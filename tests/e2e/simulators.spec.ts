import {test,expect,type Locator} from '@playwright/test';
import {login,modulePage,progress} from './helpers';
import {scamDatabase} from '../../src/data/gameData';
test.use({hasTouch:true});
for(const touch of [false,true])test(`TC-09: all five complete sequences with ${touch?'emulated touchscreen and toolbar fallback':'mouse and physical shortcuts'}`,async({page})=>{
 test.setTimeout(120000);await login(page);await modulePage(page,'simulators');
 const act=async(locator:Locator)=>{if(touch)await locator.tap();else await locator.click()};
 const button=(name:string)=>page.getByRole('button',{name,exact:true});
 const press=async(name:string)=>act(button(name));
 const back=()=>press('Back to simulators');
 await press('Screen Tap & Gentle Target Trainer');
 for(let i=1;i<=5;i++){
  const target=button(`Tap target ${i}`);await expect(target).toBeEnabled();await target.focus();const box=await target.boundingBox();
  if(touch)await page.touchscreen.tap(box!.x+box!.width/2,box!.y+box!.height/2);else await page.mouse.click(box!.x+box!.width/2,box!.y+box!.height/2);
  if(i<5)await expect(button(`Tap target ${i+1}`)).toBeEnabled();
 }
 await expect(page.getByText('Practice complete.',{exact:true})).toBeVisible();await back();
 await press('Mouse & Touchpad Action Trainer');for(let i=1;i<=5;i++)await press(`Bubble ${i}`);
 if(touch){await press('My Documents');await press('My Documents');await press('Open file context menu')}else{await button('My Documents').dblclick({delay:80});await button('Report.docx').click({button:'right'})}
 await act(page.getByRole('menuitem',{name:'Properties'}));
 for(const [device,port] of [['USB flash drive','USB-A'],['Memory card','SD card'],['USB-C drive','USB-C']]){await press(device);await press(`Connect to ${port}`)}
 const scroll=page.getByLabel('Scroll practice page');if(!touch){await scroll.hover();await page.mouse.wheel(0,600)}await press('Collect reading stamp');await press('Finish scroll practice');await expect(page.getByText('Mouse practice complete.')).toBeVisible();await back();
 await press('Desktop File & Folder Sorter');await page.getByLabel('New folder name').fill('Science Projects');await press('Create folder');await page.getByLabel('Rename asdf123.docx').fill('G6_Science_Project_Santos.docx');await press('Rename file');
 for(const [file,folder] of [['science_rep.docx','Science Projects'],['solar_diag.pdf','Science Projects'],['mayon.jpg','Science Projects'],['anthem.mp3','School Projects'],['math_wk1.docx','Math Projects'],['G6_Science_Project_Santos.docx','Science Projects']]){await press(file);await press(`Move to ${folder}`)}
 await expect(page.getByText(/Brownout Warning! Lightning storm nearby! Save in/)).toBeVisible({timeout:22000});
 if(touch)await press('Save');else{await page.getByLabel('File Explorer simulation').focus();await page.keyboard.press('Control+s')}
 await expect(page.getByText('Brownout Survivor — all files organized and safely saved.')).toBeVisible();await back();
 await press('Keyboard Shortcut Sandbox');const editor=page.getByLabel('Document editor');
 const command=async(key:string,label:string)=>{if(touch)await press(label);else{await editor.focus();await page.keyboard.press('Control+'+key)}};
 await command('a','Select all');await command('c','Copy');if(touch)await press('Move cursor to document end');else await page.keyboard.press('Control+End');await command('v','Paste');await press('Next challenge');
 await press('Simulate accidental deletion');await command('z','Undo');await press('Next challenge');
 await command('f','Find');await page.getByLabel('Find text',{exact:true}).fill('Barangay');await page.getByLabel('Find text',{exact:true}).fill('Philipines');await expect(page.getByText('6 exact matches',{exact:true})).toBeVisible();await press('Replace all with Philippines');await press('Next challenge');
 for(let i=0;i<3;i++){await press('Select citation 1');await command('x','Cut');await press('Move cursor to document end');await command('v','Paste')}
 await press('Next challenge');await command('s','Save');await expect(page.getByText('Shortcut practice complete.')).toBeVisible();await back();
 await press('Safe or Scam? Message Inspector');
 for(const [i,scenario] of scamDatabase.entries()){
  await expect(page.getByText(`Case ${i+1} / ${scamDatabase.length}`,{exact:true})).toBeVisible();for(const clue of ['Check Sender','Inspect URL Domain','Check Urgency Tone'])await press(clue);
  await press(scenario.isScam?'SCAM / PHISHING':'SAFE / LEGITIMATE');await press(i===scamDatabase.length-1?'Finish inspection':'Next case');
 }
 await expect(page.getByText('All cases accurately classified. Inspection complete.')).toBeVisible();
 await expect.poll(async()=>Object.values(await progress(page)).flatMap((p:any)=>p.completedLessons)).toEqual(expect.arrayContaining(['sim-tap','sim-mouse','sim-files','sim-shortcuts','sim-scam']));
});
