import {getValidation$} from 'in-components/timeline/components/DatePicker/stores/storeUtils';
import {createStore} from 'in-stores/store';


const dateString = createStore({
  name: 'timeline/datepicker/from/date',
  initialValue: ''
});
export const dateString$ = dateString.observable;

export function setDateString(newDate) {
  dateString.mutateTo(newDate);
}


const timeString = createStore({
  name: 'timeline/datepicker/from/time',
  initialValue: ''
});
export const timeString$ = timeString.observable;

export function setTimeString(newTime) {
  timeString.mutateTo(newTime);
}


export const isDateTimeValid$ = getValidation$(dateString$, timeString$);


export function reset() {}
