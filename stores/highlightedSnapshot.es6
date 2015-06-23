'use strict';

import create from './abstractSelectableSnapshotStore';

const store = create();

export const highlightedSnapshot = store.selectedSnapshot;
export const wiredSnapshots = store.wiredSnapshots;
export const select = store.select;
export const clear = store.clear;
