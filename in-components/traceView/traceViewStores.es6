import {createStore} from 'in-stores/store';

const fullscreenComponentStore = createStore({
  name: 'traceViewFullscreenComponent',
  initialValue: null
});

export const fullscreenComponent$ = fullscreenComponentStore.observable;

export function toggleFullscreenComponent(next) {
  fullscreenComponentStore.applyStateMutation(prev => {
    if (next === prev) {
      return null;
    }
    return next;
  });
}
