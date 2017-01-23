import {createStore} from 'in-stores/store';

const autoUpdateStore = createStore({
  name: 'eventView/stores/autoUpdate',
  initialValue: false
});
export const autoUpdate$ = autoUpdateStore.observable;


export function toggleAutoUpdate() {
  autoUpdateStore.applyStateMutation(active => !active);
}
