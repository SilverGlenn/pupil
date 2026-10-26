import {defineConfig} from 'vitest/config';
import {fileURLToPath} from 'node:url';
const stub=fileURLToPath(new URL('./module-entry.tsx',import.meta.url));
export default defineConfig({resolve:{alias:[{find:/\.\/components\/(tech\/TechModule|simulators\/SimulatorContainer|english\/EnglishModule|typing\/TypingModule|games\/GamesModule)$/,replacement:stub}]},test:{environment:'jsdom',setupFiles:['./tests/setup.ts'],include:['tests/B/**/*.test.tsx'],testTimeout:10000,pool:'forks',poolOptions:{forks:{singleFork:true}}}});
