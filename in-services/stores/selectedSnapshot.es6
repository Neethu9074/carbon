import create from './abstractSelectableSnapshotStore';

const store = create('selected snapshot');

export const selectedSnapshotCoords = store.coordinates;
export const selectedSnapshot = store.fullSnapshot;
export const select = store.select;
export const clear = store.clear;
