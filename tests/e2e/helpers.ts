import {expect,type Page} from '@playwright/test';
export async function login(page:Page,name='Joshua Dizon',pin='2222'){
 await page.goto('/');await page.getByRole('button',{name:`Sign in as ${name}`,exact:true}).click();await page.keyboard.type(pin);await expect(page.getByRole('button',{name:/Switch student/})).toBeVisible();
}
export async function modulePage(page:Page,key:string){await page.goto('/#'+key)}
export async function progress(page:Page){return page.evaluate(()=>JSON.parse(localStorage.getItem('pupil_student_progress_map')||'{}'))}
export async function dismissRecovery(page:Page){const b=page.getByRole('button',{name:/Dismiss/});if(await b.isVisible())await b.click()}
