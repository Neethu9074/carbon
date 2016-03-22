import {getHistoricalIssuesStream, getOpenIssuesStream} from 'in-services/issueTracker';
import {alwaysNull} from 'in-services/fixedStreams';
import {timeframe} from 'in-stores/timeline';
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

export function setTimeFrom(time) {
  selectedDateFromStore.applyStateMutation(prevDate => {
    const newDate = new Date(prevDate.getTime());
    newDate.setHours(time.hour());
    newDate.setMinutes(time.minute());
    newDate.setSeconds(time.second());

    return newDate;
  });
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

export function setTimeTo(time) {
  selectedDateToStore.applyStateMutation(prevDate => {
    const newDate = new Date(prevDate.getTime());
    newDate.setHours(time.hour());
    newDate.setMinutes(time.minute());
    newDate.setSeconds(time.second());

    return newDate;
  });
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
      return getHistoricalIssuesStream();
    case TIME_RANGES.LIVE:
      return getHistoricalIssuesStream()
        .merge(getOpenIssuesStream());
    default:
      return alwaysNull;
  }
});
