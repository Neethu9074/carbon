import {
  historicalEvents$,
  combinedEvents$,
  getEventType,
  EVENT_TYPES
} from 'in-services/issueTracker/issueTracker';
import {createStore} from 'in-stores/store';
import {live$} from 'in-stores/timeline';


export const events$ = live$.flatMap(live => {
  if (live) {
    return combinedEvents$;
  }
  return historicalEvents$;
});

export const categorizedEvents$ = events$.map(events => {
  const categorized = {
    changes: [],
    incidents: [],
    issues: []
  };

  events.forEach(event => {
    const eventType = getEventType(event);

    if (eventType === EVENT_TYPES.CHANGE) {
      categorized.changes.push(event);
    } else if (eventType === EVENT_TYPES.INCIDENT) {
      categorized.incidents.push(event);
    } else {
      categorized.issues.push(event);
    }
  });

  return categorized;
});


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
