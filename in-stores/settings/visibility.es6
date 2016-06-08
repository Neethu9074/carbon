import {createStore} from 'in-stores/store';

/*
  this store is used to handle the visibility of the settings dialog
*/
const showSettingsStore = createStore({
  name: 'showSettings',
  initialValue: false
});

export const showSettings$ = showSettingsStore.observable;

export function setSettingsVisibility(value) {
  showSettingsStore.applyStateMutation(() => value);
}
