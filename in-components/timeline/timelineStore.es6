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
