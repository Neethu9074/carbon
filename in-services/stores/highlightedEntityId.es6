import {createStore} from 'in-stores/store';

const highlightedEntityIdStore = createStore({
  name: 'highlighted entity id',
  initialValue: null
});

export const highlightedEntityId$ = highlightedEntityIdStore.observable.distinct();


export function setHighlightedEntityId(id) {
  highlightedEntityIdStore.mutateTo(id);
}

export function clearHighlightedEntityId() {
  highlightedEntityIdStore.mutateTo(null);
}
