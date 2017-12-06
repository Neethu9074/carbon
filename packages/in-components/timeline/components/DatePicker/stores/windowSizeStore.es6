import { timeframe$ } from 'in-stores/timeline';
import { createStore } from 'in-stores/store';

const windowSize = createStore({
  name: 'timeline/datepicker/windowsize',
  initialValue: ''
});
export const windowSize$ = windowSize.observable;

export function setWindowSize(newDate) {
  windowSize.mutateTo(newDate);
}

export function reset() {
  timeframe$.once(_timeframe => setWindowSize(_timeframe.windowSize));
}
