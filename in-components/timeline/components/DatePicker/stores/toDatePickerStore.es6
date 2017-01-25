import {setTimestamp, getValidation$} from 'in-components/timeline/components/DatePicker/stores/storeUtils';
import {createStore} from 'in-stores/store';
import {to$} from 'in-stores/timeline';


const dateString = createStore({
  name: 'timeline/datepicker/to/date',
  initialValue: ''
});
export const dateString$ = dateString.observable;

export function setDateString(newDate) {
  dateString.mutateTo(newDate);
}


const timeString = createStore({
  name: 'timeline/datepicker/to/time',
  initialValue: ''
});
export const timeString$ = timeString.observable;

export function setTimeString(newTime) {
  timeString.mutateTo(newTime);
}


export const isDateTimeValid$ = getValidation$(dateString$, timeString$);


export function reset() {
  to$.once(_to => setTimestamp(_to, setDateString, setTimeString));
}
