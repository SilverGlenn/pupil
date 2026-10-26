import {it,expect} from 'vitest';
import {createEmptyProgress,saveProgressSnapshot,deleteStudentData,flushOfflineMutationQueue,getOfflineMutationQueue,idbGet,readStored,STORAGE_KEYS} from '../src/utils/storageEngine';
it('deleting an account drains its already queued writes and prevents progress resurrection on local reconciliation',async()=>{
 const id='integration-deleted-'+crypto.randomUUID();const progress=createEmptyProgress(id);progress.completedLessons=['LES-1.1.1'];
 const pending=saveProgressSnapshot(progress);await deleteStudentData(id);await pending;await saveProgressSnapshot(progress);await flushOfflineMutationQueue();
 expect(await idbGet('progress_store',id)).toBeUndefined();expect((await getOfflineMutationQueue()).filter(m=>m.studentId===id)).toEqual([]);expect(readStored<Record<string,unknown>>(STORAGE_KEYS.progress,{})[id]).toBeUndefined();
});
