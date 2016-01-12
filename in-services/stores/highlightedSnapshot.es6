import {createStore} from 'in-stores/store';

import create from './abstractSelectableSnapshotStore';

const store = create('highlighted snapshot');

export const highlightedSnapshotCoords = store.coordinates;
export const highlightedSnapshot = store.fullSnapshot;
export const highlightedEntityId = createStore('highlighted entity id');
export const select = store.select;
export const clear = store.clear;
