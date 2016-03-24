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


/*
  this store is used to handle the not-monitoring-dialog. It will only be shown once
  so we need to keep track of this information
*/
const notMonitoringDialogShownStore = createStore({
  name: 'notMonitoringDialogShown',
  initialValue: false
});

export const notMonitoringDialogShown$ = notMonitoringDialogShownStore.observable;

export function notMonitoringWasShown() {
  notMonitoringDialogShownStore.applyStateMutation(() => true);
}
