import { getSnapshotIdsByQuery, getSnapshots } from 'in-stores/snapshot/snapshot';

export const snapshotIds$ = getSnapshotIdsByQuery('entity.selfType:website');
export const snapshots$ = snapshotIds$.flatMap(getSnapshots);
