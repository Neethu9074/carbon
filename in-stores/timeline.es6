import {create} from 'reactive-observables';
import React from 'react';

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


const focusedMoment = createStore({
  name: 'focusedMomentStore',
  initialValue: null
});
export const focusedMoment$ = focusedMoment.observable.distinct();

export function setFocusedMoment(newFocusedMoment) {
  focusedMoment.applyStateMutation(() => newFocusedMoment);
}


export const live$ = focusedMoment$.map(moment => !moment).distinct();

export const resolvedFocusedMoment$ = focusedMoment$.flatMap(_focusedMoment => {
  if (_focusedMoment == null) {
    return serverTime$.throttle(10000);
  }
  return focusedMoment$;
});

export const to$ = timeframe$.flatMap(_timeframe => {
  if (_timeframe.to) {
    return create().emit(_timeframe.to);
  }
  return serverTime$;
}).distinct();
export function setTo(to) {
  timeframeStore.applyStateMutation(prevTimeFrame => {
    return {
      windowSize: prevTimeFrame.windowSize,
      to
    };
  });
}


export const from$ = timeframe$.flatMap(_timeframe => {
  return to$.map(to => to - _timeframe.windowSize);
}).distinct();

export const timeframeShape = React.PropTypes.shape({
  windowSize: React.PropTypes.number.isRequired,
  to: React.PropTypes.number
});


export function setTimeframe(windowSize, to = null) {
  timeframeStore.applyStateMutation(() => {
    return {
      windowSize,
      to
    };
  });
}


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
