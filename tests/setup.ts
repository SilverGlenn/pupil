import 'fake-indexeddb/auto';
import { webcrypto } from 'node:crypto';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
Object.defineProperty(globalThis,'crypto',{value:webcrypto});
afterEach(()=>{cleanup();localStorage.clear();});
