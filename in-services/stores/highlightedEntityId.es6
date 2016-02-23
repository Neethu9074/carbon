import {createStore} from 'in-stores/store';

const highlightedEntityIdStore = createStore({name: 'highlighted entity id'});

export const highlightedEntityId = highlightedEntityIdStore.observable.distinct();

export function setHighlightedEntityId(id) {
  highlightedEntityIdStore.applyStateMutation(() => id);
}

export function clearHighlightedEntityId() {
  highlightedEntityIdStore.applyStateMutation(() => null);
}
