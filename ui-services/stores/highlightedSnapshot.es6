'use strict';

import create from './abstractSelectableSnapshotStore';

const store = create('highlighted snapshot');

export const highlightedSnapshot = store.selectedSnapshot;
export const wiredSnapshots = store.wiredSnapshots;
export const select = store.select;
export const clear = store.clear;
