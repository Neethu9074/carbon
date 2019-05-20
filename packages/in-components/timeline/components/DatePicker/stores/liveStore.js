import { live$ as timelineLife$ } from 'in-stores/timeline';
import { createStore } from 'in-stores/store';

const live = createStore({
  name: 'in-components/datepicker/stores/live',
  initialValue: true
});
export const live$ = live.observable;

export function setLive(value) {
  live.mutateTo(value);
}

export function reset(view) {
  if (view === true) {
    timelineLife$.once(setLive);
  } else if (view === 'fixed') {
    setLive(false);
  } else {
    setLive(true);
  }
}
