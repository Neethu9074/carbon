import {createStore} from 'in-stores/store';


const changesVisibilityStore = createStore({
  name: 'eventView/changesVisibilityStore',
  initialValue: true
});
export const changesAreVisible$ = changesVisibilityStore.observable;

export function toggle() {
  changesVisibilityStore.applyStateMutation(oldValue => !oldValue);
}

export function restoreInitialVisibilityState() {
  changesVisibilityStore.mutateTo(true);
}
