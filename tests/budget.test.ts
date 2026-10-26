import {it,expect} from 'vitest';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {randomBytes} from 'node:crypto';
it('budget command fails oversized transitive initial JS, but reports lazy bytes without counting them as initial',()=>{
 const dir=mkdtempSync(join(tmpdir(),'pupil-budget-'));mkdirSync(join(dir,'.vite'));
 const manifest={'index.html':{file:'entry.js',isEntry:true,imports:['shared'],dynamicImports:['lazy'],css:['style.css']},shared:{file:'shared.js'},lazy:{file:'lazy.js'}};
 writeFileSync(join(dir,'.vite/manifest.json'),JSON.stringify(manifest));writeFileSync(join(dir,'entry.js'),'export {};');writeFileSync(join(dir,'style.css'),'body{}');writeFileSync(join(dir,'shared.js'),randomBytes(130000));writeFileSync(join(dir,'lazy.js'),randomBytes(140000));
 try{
  const run=()=>spawnSync(process.execPath,['scripts/check-budget.mjs',dir],{encoding:'utf8'});
  let result=run();expect(result.status).toBe(1);expect(result.stdout).toContain('FAIL initial JS');
  writeFileSync(join(dir,'shared.js'),'export {};');result=run();expect(result.status).toBe(0);expect(result.stdout).toContain('PASS initial JS');expect(result.stdout).toContain('Total JS');expect(result.stdout).toContain('lazy.js');
 }finally{rmSync(dir,{recursive:true,force:true})}
});
