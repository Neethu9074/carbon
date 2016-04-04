import {historicalIssues$, combinedIssues$} from 'in-services/issueTracker';
import {alwaysNull} from 'in-services/fixedStreams';
import {timeframe} from 'in-stores/timeline';
import {createStore} from 'in-stores/store';


const dateFromStore = createStore({
  name: 'dateFromStore',
  initialValue: null
});

export const dateFrom = dateFromStore.observable;

/*
  this store is used to handle the selected ending date in the timepicker
*/
const dateToStore = createStore({
  name: 'dateToStore',
  initialValue: null
});

export const dateTo = dateToStore.observable;

export function setDateTimeFrom(date) {
  dateFromStore.applyStateMutation(() => date);
}

export function setDateTimeTo(date) {
  dateToStore.applyStateMutation(() => date);
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
  LIVE: 'live'
};

export const selectedTimePickerStore = createStore({
  name: 'selectedTimePicker',
  initialValue: TIME_PICKER.LIVE
});

export const selectedTimePicker = selectedTimePickerStore.observable;

export function setSelectedTimePicker(timepicker) {
  selectedTimePickerStore.applyStateMutation(() => timepicker);
}


/*
  this store is used to handle the different issue streams which are shown in the timelineStore

  when selecting a custom timerange, the historical issues will be streamed 1:1

  when selecting the live view, we need to merge the open issues with the historical issues in them
  selected timerange (last 1h, last 12h, ...)
*/
export const TIME_RANGES = TIME_PICKER; // you can select a fixed range or the live range
export const selectedTimeRange = timeframe.map(frame => frame.to ? TIME_RANGES.FIXED : TIME_RANGES.LIVE);

export const issue$ = selectedTimeRange.flatMap(timeRange => {
  switch (timeRange) {
    case TIME_RANGES.FIXED:
      return historicalIssues$;
    case TIME_RANGES.LIVE:
      return combinedIssues$;
    default:
      return alwaysNull;
  }
});
