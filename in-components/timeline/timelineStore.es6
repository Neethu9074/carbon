import {create, combineLatest} from 'reactive-observables';

import {
  timeframe$ as globalTimeframe$,
  setTimeframe as setGlobalTimeframe,
  focusedMoment$ as globalFocusedMoment$,
  setFocusedMoment as setGlobalFocusedMoment
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

export function hideTimeSelector() {
  showTimeSelector.applyStateMutation(() => false);
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
globalTimeframe$.subscribe(timeframe => setTimeFrame(timeframe.windowSize, timeframe.to));

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

export function setWindowSize(windowSize) {
  timeframeStore.applyStateMutation(prevTimeFrame => {
    return {
      windowSize: windowSize,
      to: prevTimeFrame.to
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


export const MIN_ZOOM_LEVEL = 1000 * 60 * 10; // 10 min
export const MAX_ZOOM_LEVEL = 1000 * 60 * 60 * 24 * 30; // 1 month (30 days)

/*
  this store is used to throttle the slider event. If the user is using the slider very fast
  we don't want to set every step between the start and goal position. therefore this store stream
  is throttled to 1sec. All values in between are ignored
*/
const windowSizeForSlider = createStore({
  name: 'windowSizeForSliderStore',
  initialValue: MIN_ZOOM_LEVEL
});

export const windowSizeForSlider$ = windowSizeForSlider.observable.distinct();

// this stream is throttled because we want to avoid fast sliding resulting in much subscriptions which
// are thrown away because they are outdated
windowSizeForSlider$
  .debounce(500)
  .subscribe(windowSize =>{
    if (windowSize) {
      setGlobalTimeframe(windowSize);
    }
  });

export function setWindowSizeForSlider(windowSize) {
  windowSize = Math.max(MIN_ZOOM_LEVEL, Math.min(MAX_ZOOM_LEVEL, windowSize));

  windowSizeForSlider.applyStateMutation(() => windowSize);
  setWindowSize(windowSize);
}

timeframe$.subscribe(tf => windowSizeForSlider.applyStateMutation(() => tf.windowSize));


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
  .throttle(1000)
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
