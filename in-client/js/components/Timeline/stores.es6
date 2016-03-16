import {createStore} from 'in-stores/store';


/*
  this store is used to handle the selected starting date in the timepicker
*/
export const selectedDateFromStore = createStore({
  name: 'selectedDateFrom',
  initialValue: new Date() // now
});

export const selectedDateFrom = selectedDateFromStore.observable;

export function setDateFrom(date) {
  selectedDateFromStore.applyStateMutation(() => date);
}

/*
  this store is used to handle the selected ending date in the timepicker
*/
export const selectedDateToStore = createStore({
  name: 'selectedDateTo',
  initialValue: new Date() // now
});

export const selectedDateTo = selectedDateToStore.observable;

export function setDateTo(date) {
  selectedDateToStore.applyStateMutation(() => date);
}


/*
  this store is used to handle the selected state of the left button in the timeline
*/
export const changeTimeButtonFromSelectedStore = createStore({
  name: 'changeTimeButtonFromSelected',
  initialValue: false
});

export const changeTimeButtonFromSelected = changeTimeButtonFromSelectedStore.observable;

export function setChangeTimeButtonFromSelected() {
  changeTimeButtonFromSelectedStore.applyStateMutation(() => true);
}

export function clearChangeTimeButtonFromSelected() {
  changeTimeButtonFromSelectedStore.applyStateMutation(() => false);
}


/*
  this store is used to handle the selected state of the left button in the timeline
*/
export const changeTimeButtonToSelectedStore = createStore({
  name: 'changeTimeButtonToSelected',
  initialValue: false
});

export const changeTimeButtonToSelected = changeTimeButtonToSelectedStore.observable;

export function setChangeTimeButtonToSelected() {
  changeTimeButtonToSelectedStore.applyStateMutation(() => true);
}

export function clearChangeTimeButtonToSelected() {
  changeTimeButtonToSelectedStore.applyStateMutation(() => false);
}


/*
  this store is used to handle the selected state of the left button in the timeline
*/
export const TIME_PICKER = {
  FIXED: 'fixed',
  LIVE: 'range'
};

export const selectedTimePickerStore = createStore({
  name: 'selectedTimePicker',
  initialValue: TIME_PICKER.LIVE
});

export const selectedTimePicker = selectedTimePickerStore.observable;

export function setSelectedTimePicker(timepicker) {
  selectedTimePickerStore.applyStateMutation(() => timepicker);
}
