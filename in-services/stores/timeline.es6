import {createStore} from './store';

// value in milliseconds
const timeframeStore = createStore({
  name: 'timeline',
  initialValue: 1000 * 60 * 10
});

export const timeframe = timeframeStore.observable;

export function setTimeframe(newTimeframe) {
  timeframeStore.applyStateMutation(() => newTimeframe);
}

export const currentRollup = timeframe.map(frame => {
  if (frame <= 1000 * 60 * 10) {
    return '1 sec';
  } else if (frame <= 1000 * 60 * 60) {
    return '5 sec';
  } else if (frame <= 1000 * 60 * 60 * 12) {
    return '1 min';
  }
  return '2 min';
});


const focusedMomentStore = createStore({
  name: 'focusedMoment',
  initialValue: null
});
export const focusedMoment = focusedMomentStore.observable;

export function setFocusedMoment(t) {
  focusedMomentStore.applyStateMutation(() => t);
}

export function clearFocusedMoment() {
  focusedMomentStore.applyStateMutation(() => null);
}
