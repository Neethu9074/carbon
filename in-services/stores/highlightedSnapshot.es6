import {createStore} from 'in-stores/store';

import create from './abstractSelectableSnapshotStore';

const store = create('highlighted snapshot');
const highlightedEntityIdStore = createStore({name: 'highlighted entity id'});

export const highlightedEntityId = highlightedEntityIdStore.observable;
export const highlightedSnapshotCoords = store.coordinates;
export const highlightedSnapshot = store.fullSnapshot;
export const select = store.select;
export const clear = store.clear;

export function setHighlightedEntityId(id) {
  highlightedEntityIdStore.applyStateMutation(() => id);
}

export function clearHighlightedEntityId() {
  highlightedEntityIdStore.applyStateMutation(() => null);
}
