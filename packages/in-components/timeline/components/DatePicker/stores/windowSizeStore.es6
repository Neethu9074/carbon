import { timeConfig$ } from 'in-stores/timeline';
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
  timeConfig$.once(_timeConfig => setWindowSize(_timeConfig.windowSize));
}
