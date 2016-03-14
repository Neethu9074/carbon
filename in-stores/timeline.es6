import {createStore} from 'in-stores/store';

// An object of the following structure
// {
//   windowSize: <number: Number of milliseconds the window should be big>
//   to?: <number: An optional, fixed end point in time>
// }
const timeframeStore = createStore({
  name: 'timeline',
  initialValue: {
    windowSize: 1000 * 60 * 10,
    to: null
  }
});


export const timeframe = timeframeStore.observable;


export function setTimeframe(windowSize, to) {
  timeframeStore.applyStateMutation(() => {
    return {
      windowSize,
      to: to == null ? null : to
    };
  });
}


export const currentRollup = timeframe.map(({windowSize}) => {
  if (windowSize <= 1000 * 60 * 10) {
    return '1 sec';
  } else if (windowSize <= 1000 * 60 * 60) {
    return '5 sec';
  } else if (windowSize <= 1000 * 60 * 60 * 12) {
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


export const selectedDateFromStore = createStore({
  name: 'selectedDateFrom',
  initialValue: new Date() // now
});

export const selectedDateFrom = selectedDateFromStore.observable;

export function setDateFrom(date) {
  selectedDateFromStore.applyStateMutation(() => date);
}

export const selectedDateToStore = createStore({
  name: 'selectedDateTo',
  initialValue: new Date() // now
});

export const selectedDateTo = selectedDateToStore.observable;

export function setDateTo(date) {
  selectedDateToStore.applyStateMutation(() => date);
}
