import {create} from 'reactive-observables';
import React from 'react';

import getBigBangTimestamp from 'in-services/subscription/bigBangTimestamp';
import {createStore, createTrackingStore} from 'in-stores/store';
import {serverTime$} from 'in-stores/serverTime';


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


export const timeframe = timeframeStore.observable.distinct();
export const timeframe$ = timeframe;

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

const focusedMoment = createStore({
  name: 'focusedMoment',
  initialValue: null
});
export const focusedMoment$ = focusedMoment.observable.distinct();

let currentTimeframe;
timeframe$.subscribe(tf => currentTimeframe = tf);

let currentServertime;
serverTime$.subscribe(st => currentServertime = st);

export function setFocusedMoment(newFocusedMoment) {
  focusedMoment.applyStateMutation(() => newFocusedMoment);
  if (newFocusedMoment && !currentTimeframe.to) {
    timeframeStore.applyStateMutation(() => {
      return {
        windowSize: currentTimeframe.windowSize,
        to: currentTimeframe.to ? currentTimeframe.to : currentServertime
      };
    });
  }
}

export function lockFocusedMoment() {
  serverTime$.once(sTime =>
    focusedMoment.applyStateMutation(prevFocusedMoment =>
      !prevFocusedMoment ? sTime : prevFocusedMoment)
  );
}

export const live$ = focusedMoment$.map(moment => !moment).distinct();

export const resolvedFocusedMoment$ = focusedMoment$.flatMap(_focusedMoment => {
  if (_focusedMoment == null) {
    return serverTime$;
  }
  return focusedMoment$;
}).distinct();


export const from$ = timeframe$.flatMap(_timeframe => {
  return to$.map(to => to - _timeframe.windowSize);
}).distinct();

export const timeframeShape = React.PropTypes.shape({
  windowSize: React.PropTypes.number.isRequired,
  to: React.PropTypes.number
});


export function setTimeframe(windowSize, to = null) {
  timeframeStore.applyStateMutation(previous => {
    if (previous.windowSize === windowSize && previous.to === to) {
      return previous;
    }
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
  highlightedMomentStore.applyStateMutation(() => {
    // discard all decimal places
    let moment = parseInt(t, 10);
    // floor to second
    moment = moment - moment % 1000;
    return moment;
  });
}

export function clearHighlightedMoment() {
  highlightedMomentStore.applyStateMutation(() => null);
}


export const bigBangTimestamp = createTrackingStore({
  name: 'bigBangTimestamp',
  observable: getBigBangTimestamp()
}).observable;

export const bigBangTimestamp$ = bigBangTimestamp;
