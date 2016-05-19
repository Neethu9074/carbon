import {create, combineLatest} from 'reactive-observables';

import {
  timeframe$ as globalTimeframe$,
  setTimeframe as setGlobalTimeframe,
  focusedMoment$ as globalFocusedMoment$,
  setFocusedMoment as setGlobalFocusedMoment
} from 'in-stores/timeline';
import {serverTime$} from 'in-stores/serverTime';
import {createStore} from 'in-stores/store';


export const MIN_ZOOM_LEVEL = 1000 * 60 * 60 * 24 * 31; // 1 month (31 days)
export const MAX_ZOOM_LEVEL = 1000 * 60 * 10; // 10 minutes


const isCollapsed = createStore({
  name: 'isTimelineCollapsedStore',
  initialValue: true
});
export const isCollapsed$ = isCollapsed.observable;

export function toggleMenu() {
  isCollapsed.applyStateMutation(oldValue => !oldValue);
}


const showTimeSelector = createStore({
  name: 'showTimeSelectorStore',
  initialValue: false
});
export const showTimeSelector$ = showTimeSelector.observable;

export function toggleShowTimeSelector() {
  showTimeSelector.applyStateMutation(oldValue => !oldValue);
}


/*
  we need to seperate the global timeline.timeframe store from this timeframeStore because
  we want to update the timelines timeframe in realtime. If the user drags in time, this store gets updated.
  When he stops dragging, the global timeframe will be updated and the complete UI will register to the new timeframe.
*/
const timeframeStore = createStore({
  name: 'timelineTimeframeStore',
  initialValue: {
    windowSize: 1000 * 60 * 10, // 10 minutes
    to: null
  }
});
export const timeframe$ = timeframeStore.observable;

// create cycle
globalTimeframe$.subscribe(timeframe => setTimeFrame(timeframe.windowSize, timeframe.to));
timeframe$.throttle(500).subscribe(timeframe => setGlobalTimeframe(timeframe.windowSize, timeframe.to));


export function setTimeFrame(windowSize, to) {
  timeframeStore.applyStateMutation(() => createTimeframe(getValidWindowSize(windowSize), to));
}

export function setTo(to) {
  timeframeStore.applyStateMutation(prevTimeFrame => createTimeframe(prevTimeFrame.windowSize, to));
}

export function setWindowSize(windowSize) {
  timeframeStore.applyStateMutation(prevTimeFrame => createTimeframe(getValidWindowSize(windowSize), prevTimeFrame.to));
}

function createTimeframe(windowSize, to) {
  return {
    windowSize: parseInt(windowSize, 10),
    to: to ? parseInt(to, 10) : null
  };
}


export function getValidWindowSize(windowSize) {
  return Math.max(MAX_ZOOM_LEVEL, Math.min(MIN_ZOOM_LEVEL, windowSize));
}


export const to$ = timeframe$.flatMap(_timeframe => _timeframe.to ? create()
                                                                    .emit(_timeframe.to)
                                                                    .freeze() :
                                                                    serverTime$)
  .distinct();

export const from$ = timeframe$
  .flatMap(_timeframe => to$.map(to => to - _timeframe.windowSize))
  .distinct();


const highlightedEventScreenPosition = createStore({
  name: 'highlightedEventScreenPositionStore',
  initialValue: null
});
export const highlightedEventScreenPosition$ = highlightedEventScreenPosition.observable.distinct();

export function setHighlightedEventScreenPosition(pos) {
  highlightedEventScreenPosition.applyStateMutation(() => pos);
}


const timelineScale = createStore({
  name: 'timelineScaleStore',
  initialValue: null
});
export const timelineScale$ = timelineScale.observable;
export function setTimelineScale(scale) {
  timelineScale.applyStateMutation(() => scale);
}


export const DRAW_MODES = {
  DISCRETE_EVENTS: 0,
  EVENTS_GRAPH: 1
};

const drawMode = createStore({
  name: 'drawModeStore',
  initialValue: DRAW_MODES.DISCRETE_EVENTS
});
export const drawMode$ = drawMode.observable.distinct();

export function setDrawMode(mode) {
  drawMode.applyStateMutation(() => mode);
}


const focusedMoment = createStore({
  name: 'timelineFocusedMomentStore',
  initialValue: null
});
export const focusedMoment$ = focusedMoment.observable.distinct();

export function setFocusedMoment(newFocusedMoment) {
  focusedMoment.applyStateMutation(() => newFocusedMoment);
}

globalFocusedMoment$.subscribe(setFocusedMoment);

focusedMoment$
  .debounce(1000)
  .subscribe(setGlobalFocusedMoment);


const focusedMomentXPosition = createStore({
  name: 'focusedMomentXPositionStore',
  initialValue: null
});
export const focusedMomentXPosition$ = focusedMomentXPosition.observable.distinct();


combineLatest([serverTime$, timelineScale$, focusedMoment$, globalTimeframe$])
  .subscribe(props => {
    const serverTime = props[0];
    const scale = props[1];
    const moment = props[2];
    const timeframe = props[3];

    if (!scale) {
      return;
    }

    let x;
    if (moment) {
      x = scale.getRange(moment);
    } else if (!timeframe.to) {
      x = scale.getRange(scale.getDomainTo());
    } else {
      x = scale.getRange(serverTime);
    }

    focusedMomentXPosition.applyStateMutation(() => x);
  });
