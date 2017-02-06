import {setTimestamp, getValidation$} from 'in-components/timeline/components/DatePicker/stores/storeUtils';
import {focusedMoment$} from 'in-stores/timeline';
import {serverTime$} from 'in-stores/serverTime';
import {createStore} from 'in-stores/store';


const dateString = createStore({
  name: 'timeline/datepicker/focusedMoment/date',
  initialValue: ''
});
export const dateString$ = dateString.observable;

export function setDateString(newDate) {
  dateString.mutateTo(newDate);
}


const timeString = createStore({
  name: 'timeline/datepicker/focusedMoment/time',
  initialValue: ''
});
export const timeString$ = timeString.observable;

export function setTimeString(newTime) {
  timeString.mutateTo(newTime);
}


export const isDateTimeValid$ = getValidation$(dateString$, timeString$).map(validate);

function validate(validationObject) {
  return validationObject;
}


export function reset() {
  focusedMoment$.once(_focusedMoment => {
    if (_focusedMoment) {
      setTimestamp(_focusedMoment, setDateString, setTimeString);
    } else {
      serverTime$.once(_serverTime => setTimestamp(_serverTime, setDateString, setTimeString));
    }
  });
}
