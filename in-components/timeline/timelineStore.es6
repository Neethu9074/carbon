import {create} from 'reactive-observables';

import {
  timeframe$ as globalTiemframe$,
  setTimeframe as setGlobalTimeframe
} from 'in-stores/timeline';
import {serverTime$} from 'in-stores/serverTime';
import {createStore} from 'in-stores/store';


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
    windowSize: null,
    to: null
  }
});
export const timeframe$ = timeframeStore.observable;
globalTiemframe$.subscribe(timeframe => setTimeFrame(timeframe.windowSize, timeframe.to));

export function setTimeFrame(windowSize, to) {
  timeframeStore.applyStateMutation(() => {
    return {
      windowSize,
      to
    };
  });
}

export function setTo(to) {
  timeframeStore.applyStateMutation(prevTimeFrame => {
    return {
      windowSize: prevTimeFrame.windowSize,
      to
    };
  });
}

export const to$ = timeframe$.flatMap(_timeframe => {
  if (_timeframe.to) {
    return create().emit(_timeframe.to).freeze();
  }
  return serverTime$;
}).distinct();

export const from$ = timeframe$.flatMap(_timeframe => {
  return to$.map(to => to - _timeframe.windowSize);
}).distinct();


const highlightedEventScreenPosition = createStore({
  name: 'highlightedEventScreenPositionStore',
  initialValue: null
});
export const highlightedEventScreenPosition$ = highlightedEventScreenPosition.observable.distinct();

export function setHighlightedEventScreenPosition(pos) {
  highlightedEventScreenPosition.applyStateMutation(() => pos);
}


/*
  this store is used to throttle the slider event. If the user is using the slider very fast
  we don't want to set every step between the start and goal position. therefore this store stream
  is throttled to 1sec. All values in between are ignored
*/
const windowSizeForSlider = createStore({
  name: 'windowSizeForSliderStore',
  initialValue: null
});
windowSizeForSlider.observable
  .distinct()
  .throttle(1000)
  .subscribe(windowSize =>{
    if (windowSize) {
      setGlobalTimeframe(windowSize);
    }
  });

export function setWindowSizeForSlider(windowSize) {
  windowSizeForSlider.applyStateMutation(() => windowSize);
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
export const drawMode$ = drawMode.observable;
export function setDrawMode(mode) {
  drawMode.applyStateMutation(() => mode);
}
