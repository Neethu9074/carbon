import React from 'react';
import {create} from 'reactive-observables';

import {serverTime$} from 'in-stores/serverTime';
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
export const timeframe$ = timeframe;

export const focusedMoment$ = timeframe$.map(_timeframe => _timeframe.to).distinct();

export const to$ = timeframe$.flatMap(_timeframe => {
  if (_timeframe.to) {
    return create().emit(_timeframe.to).freeze();
  }
  return serverTime$;
}).distinct();

export const from$ = timeframe$.flatMap(_timeframe => {
  return to$.map(to => to - _timeframe.windowSize);
}).distinct();

export const timeframeShape = React.PropTypes.shape({
  windowSize: React.PropTypes.number.isRequired,
  to: React.PropTypes.number
});


export function setTimeframe(windowSize, to) {
  timeframeStore.applyStateMutation(() => {
    return {
      windowSize,
      to
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

const highlightedMomentStore = createStore({
  name: 'highlightedMoment',
  initialValue: null
});
export const highlightedMoment$ = highlightedMomentStore.observable;

export function setHighlightedMoment(t) {
  highlightedMomentStore.applyStateMutation(() => t);
}

export function clearHighlightedMoment() {
  highlightedMomentStore.applyStateMutation(() => null);
}
