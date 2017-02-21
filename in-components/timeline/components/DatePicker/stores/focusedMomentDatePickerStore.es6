import {combineLatest} from 'reactive-observables';

import {setTimestamp, getValidation$, getTimestamp$} from 'in-components/timeline/components/DatePicker/stores/storeUtils';
import {fromTimestamp$} from 'in-components/timeline/components/DatePicker/stores/fromDatePickerStore';
import {toTimestamp$} from 'in-components/timeline/components/DatePicker/stores/toDatePickerStore';
import {formatDate, formatDateTime, parseDate} from 'in-services/formatters/date';
import {focusedMoment$} from 'in-stores/timeline';
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


export const focusedMomentTimestamp$ = getTimestamp$(dateString$, timeString$);
export const timestamp$ = focusedMomentTimestamp$;


export let isDateTimeValid$;

export function reset() {
  isDateTimeValid$ = combineLatest([fromTimestamp$, toTimestamp$, getValidation$(focusedMomentTimestamp$)])
                                  .map(([fromTimestamp, toTimestamp, validationObject]) => {
                                    if (!validationObject.date || !validationObject.time) {
                                      return validationObject;
                                    }

                                    fromTimestamp = fromTimestamp || 0;
                                    toTimestamp = toTimestamp || Number.MAX_VALUE;

                                    const focusedMomentTimestamp = validationObject.timestamp;
                                    const focusedMomentTimestamp_date = validationObject.timestamp_date;

                                    const fromTimestamp_date = parseDate(formatDate(fromTimestamp)).getTime();
                                    const toTimestamp_date = parseDate(formatDate(toTimestamp)).getTime();

                                    const date  = focusedMomentTimestamp_date >= fromTimestamp_date && focusedMomentTimestamp_date <= toTimestamp_date;

                                    // we don't want to validate the time when the date is already invalid. Makes no sense to validate
                                    // it since our basis for invalidation is not existing.
                                    const time = (!date) ? true : focusedMomentTimestamp >= fromTimestamp && focusedMomentTimestamp <= toTimestamp;

                                    if (!date || !time) {
                                      validationObject.hint = `The selected moment is not between ${formatDateTime(fromTimestamp)} and ${formatDateTime(toTimestamp)}.`;
                                    }

                                    return {
                                      date: true,
                                      time: true,
                                      timestamp: validationObject.timestamp,
                                      hint: validationObject.hint
                                    };
                                  });
  focusedMoment$.once(_focusedMoment => {
    _focusedMoment
      ? setTimestamp(_focusedMoment, setDateString, setTimeString)
      : setTimestamp(Date.now(), setDateString, setTimeString);
  });
}
