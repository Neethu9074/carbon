import create from './abstractSelectableSnapshotStore';

const store = create('highlighted snapshot');

export const highlightedSnapshotCoords = store.coordinates;
export const highlightedSnapshot = store.fullSnapshot;
export const select = store.select;
export const clear = store.clear;
