import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
it('updated workers wait for old tabs instead of evicting the chunks their running index still needs',async()=>{
 const handlers:Record<string,(event:any)=>void>={};const cached:string[][]=[];let skipped=false;
 const self={__PUPIL_PRECACHE__:['/index.html','/assets/lazy.js'],location:{origin:'https://pupil.test'},addEventListener:(name:string,callback:any)=>handlers[name]=callback,skipWaiting:()=>{skipped=true},clients:{claim:async()=>{}}};
 const caches={open:async()=>({addAll:async(paths:string[])=>cached.push(paths)})};
 runInNewContext(readFileSync('public/sw.js','utf8'),{self,caches,URL,Response});let installed:Promise<unknown>=Promise.resolve();handlers.install({waitUntil:(p:Promise<unknown>)=>installed=p});await installed;
 expect(cached).toEqual([['/index.html','/assets/lazy.js']]);expect(skipped).toBe(false);
});

it('activation removes only obsolete Pupil caches; navigation and cached JSON remain usable offline',async()=>{
 const handlers:Record<string,(event:any)=>void>={};const deleted:string[]=[];const shellResponse={kind:'shell'},dataResponse={kind:'curriculum'};let claimed=false;
 const caches={keys:async()=>['pupil-shell-old','pupil-data-old','pupil-shell-__PUPIL_BUILD__','pupil-data-__PUPIL_BUILD__','other-app'],delete:async(key:string)=>deleted.push(key),open:async(name:string)=>({match:async(key:any)=>name.startsWith('pupil-data-')?dataResponse:key==='/index.html'?shellResponse:undefined,put:async()=>{}})};
 const self={location:{origin:'https://pupil.test'},addEventListener:(name:string,callback:any)=>handlers[name]=callback,clients:{claim:async()=>{claimed=true}}};
 runInNewContext(readFileSync('public/sw.js','utf8'),{self,caches,URL,Response,fetch:async()=>{throw new Error('offline')}});
 let activation:Promise<unknown>=Promise.resolve();handlers.activate({waitUntil:(p:Promise<unknown>)=>activation=p});await activation;expect(deleted).toEqual(['pupil-shell-old','pupil-data-old']);expect(claimed).toBe(true);
 for(const [request,want] of [[{url:'https://pupil.test/new-route',method:'GET',mode:'navigate'},shellResponse],[{url:'https://pupil.test/curriculum.json',method:'GET',mode:'cors'},dataResponse]] as const){let response:Promise<unknown>|undefined;const work:Promise<unknown>[]=[];handlers.fetch({request,respondWith:(p:Promise<unknown>)=>response=p,waitUntil:(p:Promise<unknown>)=>work.push(p)});expect(await response).toBe(want);await Promise.all(work)}
 let intercepted=false;for(const request of [{url:'https://other.test/data.json',method:'GET'},{url:'https://pupil.test/save',method:'POST'}])handlers.fetch({request,respondWith:()=>intercepted=true});expect(intercepted).toBe(false);
});
