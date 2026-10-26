import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
test('TC-12: first visit precaches every build chunk, offline refresh opens every unvisited module',async({page,context})=>{
 page.on('pageerror',error=>console.log('BROWSER ERROR',error.message));page.on('requestfailed',request=>console.log('REQUEST FAILED',request.url(),request.failure()));
 await page.goto('/');await expect(page.getByRole('button',{name:'Sign in as Aya Cruz'})).toBeVisible();
 const response=await page.request.get('/manifest.json');expect(response.headers()['content-type']).toContain('json');
 const manifest=await response.json();expect(manifest.name).toBe('Pupil PH');expect(manifest.icons.map((i:{sizes:string})=>i.sizes)).toEqual(['192x192','512x512']);
 await page.evaluate(async()=>{await navigator.serviceWorker.ready});
 await expect.poll(()=>page.evaluate(()=>caches.keys())).toContainEqual(expect.stringMatching(/^pupil-shell-/));
 await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 await context.setOffline(true);await page.reload();await expect(page.getByRole('button',{name:'Sign in as Aya Cruz'})).toBeVisible();
 await page.getByRole('button',{name:'Sign in as Mark Santos'}).click();await page.keyboard.type('4444');await expect(page.locator('#app-root')).toHaveAttribute('data-stage','studio');
 for(const [key,heading] of [['tech','Tech literacy'],['simulators','Simulators'],['english','English workspace'],['typing','Precision typing studio'],['games','Practice studio']]){
  await page.goto('/#'+key);await expect(page.getByRole('heading',{name:heading,exact:false}).first()).toBeVisible();
 }
 const cache=await page.evaluate(async()=>{const names=await caches.keys();const c=await caches.open(names.find(n=>n.startsWith('pupil-shell-'))!);return(await c.keys()).map(r=>new URL(r.url).pathname)});
 const built=JSON.parse(readFileSync('dist/.vite/manifest.json','utf8'));const chunks=Object.values(built).map((item:any)=>'/'+item.file).filter(path=>path.endsWith('.js'));expect(cache).toEqual(expect.arrayContaining(chunks));expect(chunks.length).toBeGreaterThan(0);
 const icons=await page.evaluate(async()=>Promise.all([192,512].map(async size=>{const image=new Image();image.src=`/icon-${size}.png`;await image.decode();return [image.naturalWidth,image.naturalHeight]})));expect(icons).toEqual([[192,192],[512,512]]);
});
