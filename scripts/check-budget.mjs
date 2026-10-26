import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {gzipSync} from 'node:zlib';
const root=resolve(process.argv[2]||'dist');
const manifest=JSON.parse(readFileSync(resolve(root,'.vite/manifest.json'),'utf8'));
const initial=new Set(),css=new Set(),visited=new Set();
function visit(key){if(visited.has(key))return;visited.add(key);const item=manifest[key];if(!item)throw new Error(`Missing manifest entry ${key}`);initial.add(item.file);for(const file of item.css||[])css.add(file);for(const child of item.imports||[])visit(child)}
for(const [key,item] of Object.entries(manifest))if(item.isEntry)visit(key);
const size=file=>gzipSync(readFileSync(resolve(root,file))).length;
const list=(directory,prefix='')=>readdirSync(directory,{withFileTypes:true}).flatMap(item=>item.isDirectory()?list(resolve(directory,item.name),prefix+item.name+'/'):[prefix+item.name]);
const js=list(root).filter(file=>file.endsWith('.js')&&file!=='sw.js');
const initialBytes=[...initial].filter(file=>file.endsWith('.js')).reduce((sum,file)=>sum+size(file),0),cssBytes=[...css].reduce((sum,file)=>sum+size(file),0),totalBytes=js.reduce((sum,file)=>sum+size(file),0);
const show=bytes=>`${(bytes/1000).toFixed(2)} KB gzip (${bytes} bytes)`;
console.log(`${initialBytes<=120000?'PASS':'FAIL'} initial JS: ${show(initialBytes)} / 120 KB`);
console.log(`${cssBytes<=30000?'PASS':'FAIL'} initial CSS: ${show(cssBytes)} / 30 KB`);
console.log(`Total JS: ${show(totalBytes)}; ${js.length} chunks (excluding service worker)`);
for(const file of js.sort())console.log(`  ${initial.has(file)?'initial':'lazy   '} ${file}: ${show(size(file))}`);
if(totalBytes>120000)console.log('NOTE: total offline JS exceeds 120 KB; the initial-load budget is enforced, not misreported as total.');
if(initialBytes>120000||cssBytes>30000)process.exitCode=1;
