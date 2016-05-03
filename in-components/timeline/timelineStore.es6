import {createStore} from 'in-stores/store';

const isCollapsed = createStore({
  name: 'isTimelineCollapsedStore',
  initialValue: false
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
export const timeframeStore$ = timeframeStore.observable;

export function setTimeFrame(windowSize, to) {
  timeframeStore.applyStateMutation(() => {
    return {
      windowSize,
      to
    };
  });
}

const toStore = createStore({
  name: 'timelineToStore',
  initialValue: null
});
export function setTo(to) {
  toStore.applyStateMutation(() => to);
}


const highlightedEventXPosition = createStore({
  name: 'highlightedEventXPositionStore',
  initialValue: null
});
export const highlightedEventXPosition$ = highlightedEventXPosition.observable.distinct();

export function setHighlightedEventXPosition(pos) {
  highlightedEventXPosition.applyStateMutation(() => pos);
}
