import {defineConfig,type Plugin} from 'vite';
import react from '@vitejs/plugin-react';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
function offlineShell():Plugin {
 let output='';
 return {name:'pupil-complete-offline-shell',apply:'build',configResolved(config){output=resolve(config.root,config.build.outDir)},closeBundle(){
  const files=(directory:string,prefix=''):string[]=>readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(resolve(directory,entry.name),prefix+entry.name+'/'):[prefix+entry.name]);
  const paths=files(output).filter(path=>path!=='sw.js').sort();
  const template=readFileSync('public/sw.js','utf8');
  const hash=createHash('sha256').update(template);for(const path of paths)hash.update(path).update(readFileSync(resolve(output,path)));
  const version=hash.digest('hex').slice(0,16);
  writeFileSync(resolve(output,'sw.js'),`self.__PUPIL_PRECACHE__=${JSON.stringify(paths.map(path=>'/'+path))};\n`+template.replace('__PUPIL_BUILD__',version));
 }};
}
export default defineConfig({plugins:[react(),offlineShell()],build:{target:'es2022',manifest:true,rollupOptions:{output:{manualChunks(id){if(id.includes('node_modules'))return 'vendor';if(id.includes('/src/data/')&&!id.endsWith('/initialRoster.ts'))return 'data-'+id.split('/').pop()!.replace('.ts','');}}}}});
