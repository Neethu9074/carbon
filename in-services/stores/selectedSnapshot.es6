

import create from './abstractSelectableSnapshotStore';

const store = create('selected snapshot');

export const selectedSnapshot = store.selectedSnapshot;
export const wiredSnapshots = store.wiredSnapshots;
export const select = store.select;
export const clear = store.clear;
