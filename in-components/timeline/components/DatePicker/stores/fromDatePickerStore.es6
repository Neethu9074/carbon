import {combineLatest} from 'reactive-observables';

import {setTimestamp, getValidation$, getTimestamp$} from 'in-components/timeline/components/DatePicker/stores/storeUtils';
import {toTimestamp$} from 'in-components/timeline/components/DatePicker/stores/toDatePickerStore';
import {formatDate, parseDate} from 'in-services/formatters/date';
import {createStore} from 'in-stores/store';
import {from$} from 'in-stores/timeline';


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


export const fromTimestamp$ = getTimestamp$(dateString$, timeString$);


export let isDateTimeValid$;

export function reset() {
  isDateTimeValid$ = combineLatest([toTimestamp$, getValidation$(fromTimestamp$)])
                                  .map(([toTimestamp, validationObject]) => {
                                    if (!validationObject.date || !validationObject.time) {
                                      return validationObject;
                                    }

                                    // if there is no to timestamp and the date is in a valid range, return true
                                    if (!toTimestamp) {
                                      return {
                                        date: true,
                                        time: true,
                                        timestamp: validationObject.timestamp
                                      };
                                    }

                                    const fromTimestamp = validationObject.timestamp;
                                    const fromTimestamp_date = validationObject.timestamp_date;

                                    const toTimestamp_date = parseDate(formatDate(toTimestamp)).getTime();

                                    const date  = fromTimestamp_date <= toTimestamp_date;

                                    // we don't want to validate the time when the date is already invalid. Makes no sense to validate
                                    // it since our basis for invalidation is not existing.
                                    const time = (!date) ? true : fromTimestamp < toTimestamp;

                                    return {
                                      date,
                                      time,
                                      timestamp: validationObject.timestamp
                                    };
                                  });

  from$.once(_from => setTimestamp(_from, setDateString, setTimeString));
}
