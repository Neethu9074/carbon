import { create } from '@instana/observables';

import { createStore } from 'in-stores/store';

export const noExpandedSides$ = create()
  .emit(null)
  .freeze();

export function createExpandedViewStore(name, initialValue = null) {
  const store = createStore({
    name,
    initialValue
  });

  return {
    expandedSide$: store.observable,

    toggleLeft() {
      store.applyStateMutation(side => (side === 'left' ? null : 'left'));
    },

    toggleRight() {
      store.applyStateMutation(side => (side === 'right' ? null : 'right'));
    },

    set(value) {
      store.mutateTo(value);
    }
  };
}
