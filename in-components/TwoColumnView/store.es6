import {create} from 'reactive-observables';

import {createStore} from 'in-stores/store';

export const noExpandedSides$ = create().emit(null).freeze();

export function createExpandedViewStore(name) {
  const store = createStore({
    name,
    initialValue: null
  });

  return {
    expandedSide$: store.observable,

    toggleLeft() {
      store.applyStateMutation(side => side === 'left' ? null : 'left');
    },

    toggleRight() {
      store.applyStateMutation(side => side === 'right' ? null : 'right');
    }
  };
}
