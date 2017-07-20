import { getSnapshotsByQuery } from 'in-stores/snapshot/snapshot';

export const snapshots$ = getSnapshotsByQuery('entity.selfType:website');
