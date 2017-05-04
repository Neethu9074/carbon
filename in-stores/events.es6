/* global process:false */
import { combineLatest } from 'reactive-observables';
import { sortedIndexBy } from 'lodash';
import { List, Map } from 'immutable';

import { setHighlightedEntityId, clearHighlightedEntityId } from 'in-services/stores/highlightedEntityId';
import createTotalRawEventsSubscription from 'in-services/subscription/totalRawEventsCount';
import { getEvent, getEventType, EVENT_TYPES } from 'in-services/issueTracker';
import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import getEventUpdates from 'in-services/subscription/eventUpdates';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { createStore, createTrackingStore } from 'in-stores/store';
import { focusedMoment$, timeframe$ } from 'in-stores/timeline';
import getOpenEvents from 'in-services/subscription/openEvents';
import getEvents from 'in-services/subscription/events';
import { alwaysNull } from 'in-services/fixedStreams';

const maxDataRetrieval = 1000 * 60 * 60 * 24 * 31; // one month

export const retrievedEvents$ = createTrackingStore({
  name: 'retrievedEvents',
  observable: timeframe$
    .flatMap(timeframe => {
      return getEvents({
        // Increase amount of retrieved data to ensure smooth vertical scrolling.
        to: timeframe.to == null ? null : timeframe.to + timeframe.windowSize / 2,

        // load at most one month worth of data
        windowSize: Math.min(timeframe.windowSize * 2, maxDataRetrieval)
      });
    })
    .merge(getEventUpdates(), getOpenEvents(), focusedMoment$.flatMap(getOpenEvents))
    .scan(insertEventsToStoreSorted, {
      // Sorted array of events[] by start time. Permits quick lookup of events within a
      // time range. Each events[] has a time property for fast lookups and comparisons
      issues: [],
      changes: [],
      incidents: [],
      objectives: []
    })
}).observable
  .startWith({
    issues: [],
    changes: [],
    incidents: [],
    objectives: []
  })
  .throttle(process.env.IS_TEST ? 0 : 1000);

function insertEventsToStoreSorted(store, update) {
  for (let i = 0, length = update.size; i < length; i++) {
    insertSorted(store, update.get(i));
  }
  return store;
}

const openEventsAtServerTime = createStore({
  name: 'openEventsAtServerTime',
  initialValue: null
});
export const openEventsAtServerTime$ = openEventsAtServerTime.observable.distinct();

export function init() {
  createTotalRawEventsSubscription({
    timeframe: { to: null, windowSize: 1 }
  }).subscribe(result => openEventsAtServerTime.mutateTo(result));
}

export const openEventsAtFocusedMoment$ = createTrackingStore({
  name: 'openEventsAtFocusedMoment',
  observable: combineLatest([focusedMoment$, retrievedEvents$]).map(filterOpenEventsAtFocusedMoment)
}).observable;

function filterOpenEventsAtFocusedMoment([focusedMoment, events]) {
  return {
    issues: events.issues.filter(filter),
    changes: events.changes.filter(filter),
    incidents: events.incidents.filter(filter),
    objectives: events.objectives.filter(filter)
  };

  function filter(event) {
    return isEventOpenAtFocusedMoment(event.start, event.end, event.state, focusedMoment);
  }
}

export const getOpenIssuesAtFocusedMoment = memoize(
  // TODO an index by entity would be great, but probably more expensive to
  // maintain than actually to loop?
  snapshotId =>
    openEventsAtFocusedMoment$.map(events => {
      return List(events.issues.filter(event => event.getIn(['problem', 'snapshotId']) === snapshotId));
    }),
  id => id,
  3000
);

export const getHealthInfoAtFocusedMoment = memoize(
  snapshotId =>
    getOpenIssuesAtFocusedMoment(snapshotId)
      .scan(addHealthInfo, {})
      .distinct()
      .map(mutableHealthInfo => Map(mutableHealthInfo)),
  id => id,
  3000
);

function addHealthInfo(prevHealthInfo, issues) {
  const nextHealthInfo = {
    maxSeverity: 0,
    issueWithMaxSeverity: null,
    numberOfOpenIssues: issues.size
  };

  issues.forEach(issue => {
    const severity = issue.getIn(['problem', 'severity'], 0);
    if (severity >= nextHealthInfo.maxSeverity) {
      nextHealthInfo.maxSeverity = severity;
      nextHealthInfo.issueWithMaxSeverity = issue;
    }
  });

  if (
    prevHealthInfo.maxSeverity !== nextHealthInfo.maxSeverity ||
    prevHealthInfo.issueWithMaxSeverity !== nextHealthInfo.issueWithMaxSeverity ||
    prevHealthInfo.numberOfOpenIssues !== nextHealthInfo.numberOfOpenIssues
  ) {
    return nextHealthInfo;
  }
  return prevHealthInfo;
}

/**
 * Searches for the issue with the highest severity and returns it or the first
 * if many have the same severity
 *
 * @param {number} snapshotId The id to filter the event stream
 * @returns {Observable<Event>} The event with the highest severity
 */
export function getMostImportantEventAtFocusedMoment(snapshotId) {
  return getHealthInfoAtFocusedMoment(snapshotId).map(healthInfo => healthInfo.get('issueWithMaxSeverity')).distinct();
}

export function fireCallbacksForEventAtFocusedMomentAsStream(event, ifOpen, ifClosed) {
  const start = event.get('start');
  const end = event.get('end');
  const state = event.get('state');
  const severity = event.getIn(['problem', 'severity'], 0);

  return focusedMoment$
    .map(focusedMoment => {
      if (isEventOpenAtFocusedMoment(start, end, state, focusedMoment)) {
        return ifOpen({ event, severity, focusedMoment });
      }
      return ifClosed({ event, severity, focusedMoment });
    })
    .distinct();
}

export function isEventOpenAtFocusedMoment(start, end, state, focusedMoment) {
  // We must believe in state == open and should not use the focused moment to compare
  // against start and end (even when not in live mode) as processing lags may
  // cause the end date to be inaccurate.
  if (state === 'open') {
    return true;
  }

  // live mode, state == closed which always means false
  if (focusedMoment == null) {
    return false;
  }

  return start <= focusedMoment && focusedMoment < end;
}

function insertSorted(store, event) {
  const time = event.get('triggeringTime', event.get('start'));
  const id = event.get('id');
  // Assigning some props to immutable object to allow for faster binary search and filtering
  event.time = time;
  event.id = id;
  event.start = event.get('start');
  event.end = event.get('end');
  event.state = event.get('state');
  const type = event.get('type');
  const byTime = store[type + 's'];

  const index = sortedIndexBy(byTime, event, e => e.time);

  const existingItem = byTime[index];
  if (existingItem) {
    if (existingItem.time !== time) {
      // event with new time
      byTime.splice(index, 0, event);
    } else if (existingItem.id === event.id) {
      // updates
      byTime[index] = event;
    } else {
      let i = index;
      let found = false;
      while (byTime[i] && byTime[i].time === time && !found) {
        if (byTime[i].id === id) {
          // update
          byTime[i] = event;
          found = true;
        }
        i++;
      }

      if (!found) {
        byTime.splice(index, 0, event);
      }
    }
  } else {
    byTime.splice(index, 0, event);
  }
}

export function getNearestEvent(events, timestamp, maxDistance = Number.MAX_VALUE) {
  if (events.length === 0) {
    return null;
  }

  let nearestEvent = null;
  let minDistance = Number.MAX_VALUE;
  for (let i = 0, length = events.length; i < length; i++) {
    const event = events[i];
    const distance = Math.abs(timestamp - event.time);
    if (distance < maxDistance && distance < minDistance) {
      minDistance = distance;
      nearestEvent = event;
    }
  }
  return nearestEvent;
}

const highlightedEvent = createStore({
  name: 'highlightedEventStore',
  initialValue: null
});
export const highlightedEvent$ = highlightedEvent.observable
  .distinct()
  // Event highlighting is prone to high frequency changes. We need to protect the backend
  // against this as retrieving the data for event displaying is expensive to retrieve
  // (entities for highlighting).
  .debounce(200);

export function setHighlightedEvent(event) {
  highlightedEvent.applyStateMutation(() => event);
  if (event) {
    setHighlightedEntityId(event.getIn(['problem', 'snapshotId']));
  } else {
    clearHighlightedEntityId();
  }
}

export function selectEvent(event) {
  if (event) {
    mutateUrl(navParams => {
      navParams.query.eventId = event.get('id');
      return navParams;
    });
  } else {
    mutateUrl(navParams => {
      delete navParams.query.eventId;
      return navParams;
    });
  }
}

export function clearSelectedEvent() {
  mutateUrl(navParams => {
    delete navParams.query.eventId;
    return navParams;
  });
}

export const selectedEventId$ = createTrackingStore({
  name: 'events/selectedEventId',
  observable: navigationParameters$
    .map(params => {
      const query = params.query;
      if ('eventId' in query) {
        return query.eventId;
      }
      return null;
    })
    .distinct()
}).observable;

export const selectedEvent$ = createTrackingStore({
  name: 'events/selectedEvent',
  observable: selectedEventId$.flatMap(id => (id ? getEvent(id) : alwaysNull)).distinct()
}).observable;

export const selectedIncident$ = createTrackingStore({
  name: 'events/selectedIncident',
  observable: selectedEvent$.map(event => (event == null || event.get('type') === 'incident' ? event : null))
}).observable;

export const selectedObjective$ = createTrackingStore({
  name: 'events/selectedObjective',
  observable: selectedEvent$.map(event => (event == null || event.get('type') === 'objective' ? event : null))
}).observable;

export function countEvents(events) {
  const counter = {
    warning: 0,
    danger: 0,
    change: 0,
    incident: 0,
    objective: 0
  };

  events.forEach(event => {
    switch (getEventType(event)) {
      case EVENT_TYPES.ISSUE_WARNING:
        counter.warning++;
        break;
      case EVENT_TYPES.ISSUE_CRITICAL:
        counter.danger++;
        break;
      case EVENT_TYPES.CHANGE:
        counter.change++;
        break;
      case EVENT_TYPES.INCIDENT:
        counter.incident++;
        break;
      case EVENT_TYPES.OBJECTIVE:
        counter.objective++;
        break;
      default:
    }
  });

  return counter;
}

export function getColorByEvent({ event, focusedMoment, theme = 'night' }) {
  const severity = event.getIn(['problem', 'severity'], 0);
  const start = event.get('start');
  const end = event.get('end');
  const state = event.get('state');
  const color = getColorBySeverity(severity);

  // No focused moment? Then it is according to server time which means
  // we color based on the state property.
  if (isEventOpenAtFocusedMoment(start, end, state, focusedMoment)) {
    return color;
  }
  return getColorBySeverity(0, { theme });
}

export function getColorForEventAtFocusedMomentAsStream(event, theme) {
  return focusedMoment$.map(focusedMoment => getColorByEvent({ event, focusedMoment, theme }));
}

export function getColorForMostSevereEvents(events) {
  let eventWithMaxSeverity = null;
  let maxSeverity = 0;
  events.forEach(event => {
    const severity = event.getIn(['problem', 'severity'], 0);
    if (severity > maxSeverity) {
      maxSeverity = severity;
      eventWithMaxSeverity = event;
    }
  });
  return getColorByEvent({ event: eventWithMaxSeverity });
}

const health = [
  '#ffffff',
  '#e3e2b8',
  '#eae18a',
  '#f1e05c',
  '#f8df2e',
  '#ffde00',
  '#ffbf08',
  '#ffa010',
  '#ff8019',
  '#ff6121',
  '#ff4229'
];

export function getColorBySeverity(severity, params = {}) {
  if (severity > 0 && severity <= 1) {
    // 0.51 -> 5.1
    severity = severity * 10;
  }
  // 5.1 -> 5
  severity = severity | 0;
  if (severity === 0 && params.theme === 'day') {
    return '#bababa';
  }
  return health[Math.max(0, severity) | 0];
}
