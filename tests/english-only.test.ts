import {it,expect} from 'vitest';
import {readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import ts from 'typescript';
it('TC-14: production string literals contain no translation prompts or common translated UI instructions',()=>{
 const paths=(dir:string):string[]=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?paths(join(dir,e.name)):/\.tsx?$/.test(e.name)?[join(dir,e.name)]:[]);
 // Cultural nouns and proper names (barangay, sari-sari, Jose Rizal, etc.) are intentional source English context.
 const banned=/\b(kumusta|salamat|pindutin|magpatuloy|magsimula|isulat ang|piliin ang|tamang sagot|maling sagot|sa tagalog|tagalog translation|filipino translation)\b/i;
 const findings:string[]=[];let strings=0;
 for(const path of paths('src')){const tree=ts.createSourceFile(path,readFileSync(path,'utf8'),ts.ScriptTarget.Latest,true,path.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);const visit=(node:ts.Node)=>{if(ts.isStringLiteralLike(node)||ts.isJsxText(node)){strings++;if(banned.test(node.text))findings.push(`${path}: ${node.text}`)}ts.forEachChild(node,visit)};visit(tree)}
 expect(strings).toBeGreaterThan(5000);expect(findings).toEqual([]);console.log(`TC14 audited ${strings} production literal/JSX text nodes; independent curriculum fidelity checks are tests/A/fidelity.test.ts`);
});
