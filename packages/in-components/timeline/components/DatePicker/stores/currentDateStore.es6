import { createStore } from 'in-stores/store';

const currentDateStore = createStore({
  name: 'timeline/datepicker/currentDateStore',
  initialValue: null
});
export const currentDateStore$ = currentDateStore.observable;

export function toggleDateStore(store) {
  currentDateStore.applyStateMutation(oldStore => (oldStore === store ? null : store));
}

export function setDateStore(store) {
  currentDateStore.mutateTo(store);
}
