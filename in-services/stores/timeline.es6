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


const focusedMomentStore = createStore({
  name: 'focusedMoment',
  initialValue: null
});
export const focusedMoment = focusedMomentStore.observable;

const currentRollupStore = createStore({
  name: 'currentRollup',
  initialValue: 1
});
export const currentRollup = currentRollupStore.observable;

export function setFocusedRoolup(t) {
  currentRollupStore.applyStateMutation(() => t);
}

export function setFocusedMoment(t) {
  focusedMomentStore.applyStateMutation(() => t);
}

export function clearFocusedMoment() {
  focusedMomentStore.applyStateMutation(() => null);
}
