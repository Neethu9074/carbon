/* global process:false */
import { combineLatest } from 'reactive-observables';
import { sortedIndexBy } from 'lodash';
import { List, Map } from 'immutable';

import { setHighlightedEntityId, clearHighlightedEntityId } from 'in-services/stores/highlightedEntityId';
import createTotalRawEventsSubscription from 'in-services/subscription/totalRawEventsCount';
import { getEvent, getEventType, EVENT_TYPES } from 'in-services/issueTracker';
import { focusedMoment$, timeframe$, to$, from$ } from 'in-stores/timeline';
import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import getEventUpdates from 'in-services/subscription/eventUpdates';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { createStore, createTrackingStore } from 'in-stores/store';
import getOpenEvents from 'in-services/subscription/openEvents';
import getEvents from 'in-services/subscription/events';
import { alwaysNull } from 'in-services/fixedStreams';
import { theme } from 'in-services/theme';

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
    .scan(
      (store, update) => {
        update.forEach(event => insertSorted(store, event));
        return store;
      },
      {
        // Sorted array of events[] by start time. Permits quick lookup of events within a
        // time range. Each events[] has a time property for fast lookups and comparisons
        issues: [],
        changes: [],
        incidents: [],
        objectives: []
      }
    )
}).observable
  .startWith({
    issues: [],
    changes: [],
    incidents: [],
    objectives: []
  })
  .throttle(process.env.IS_TEST ? 0 : 1000);

export const eventsInTimeframe$ = combineLatest([
  timeframe$.flatMap(timeframe => {
    if (timeframe.to == null) {
      return to$.throttle(10000);
    }
    return to$;
  }),
  from$,
  retrievedEvents$
]).map(([to, from, events]) => {
  // TODO improve perf by doing a binary search for from
  return {
    issues: filter(events.issues),
    changes: filter(events.changes),
    incidents: filter(events.incidents),
    objectives: filter(events.objectives)
  };

  function filter(eventsToFiler) {
    const result = [];

    for (let i = 0, len = eventsToFiler.length; i < len; i++) {
      const event = eventsToFiler[i];
      if (event.time < from) {
        const eventTo = event.state === 'open' ? Number.MAX_VALUE : event.end;
        if (eventTo < from) {
          continue;
        }
      } else if (event.time > to) {
        break;
      }

      result.push(event);
    }

    return result;
  }
});

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
  observable: combineLatest([focusedMoment$, retrievedEvents$]).map(([focusedMoment, events]) => {
    return {
      issues: events.issues.filter(filter),
      changes: events.changes.filter(filter),
      incidents: events.incidents.filter(filter),
      objectives: events.objectives.filter(filter)
    };

    function filter(event) {
      return isEventOpenAtFocusedMoment(event.start, event.end, event.state, focusedMoment);
    }
  })
}).observable;

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
      .scan((prevHealthInfo, issues) => {
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
      }, {})
      .distinct()
      .map(mutableHealthInfo => Map(mutableHealthInfo)),
  id => id,
  3000
);

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

export function getColorForEventAtFocusedMomentAsStream(event, defaultColor) {
  return fireCallbacksForEventAtFocusedMomentAsStream(
    event,
    // if open
    ({ severity }) => {
      let color = theme.health[severity];
      if (severity === 0 && defaultColor) {
        color = defaultColor;
      }
      return color;
    },
    // if closed
    () => (defaultColor ? defaultColor : theme.health[0])
  );
}

export function fireCallbacksForEventAtFocusedMomentAsStream(event, ifOpen, ifClosed) {
  const start = event.get('start');
  const end = event.get('end');
  const state = event.get('state');
  const severity = event.getIn(['problem', 'severity'], 0);

  return focusedMoment$
    .map(focusedMoment => {
      if (isEventOpenAtFocusedMoment(start, end, state, focusedMoment)) {
        return ifOpen({ severity, focusedMoment });
      }
      return ifClosed({ severity, focusedMoment });
    })
    .distinct();
}

export function getColorForEventAtFocusedMoment(event, focusedMoment) {
  const severity = event.getIn(['problem', 'severity'], 0);
  const start = event.get('start');
  const end = event.get('end');
  const state = event.get('state');
  const color = theme.health[severity];

  // No focused moment? Then it is according to server time which means
  // we color based on the state property.
  const open = isEventOpenAtFocusedMoment(start, end, state, focusedMoment);

  if (open) {
    return color;
  }

  return theme.health[0];
}

export function isEventOpenAtFocusedMoment(start, end, state, focusedMoment) {
  // No focused moment? Then it is according to server time which means
  // we color based on the state property.
  return (
    (focusedMoment == null && state === 'open') ||
    ((start <= focusedMoment && (focusedMoment < end || !end)) || state === 'open')
  );
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

  let index = sortedIndexBy(events, { time: timestamp }, event => event.time);

  let B = events[index];
  if (!B) {
    index = events.length - 1;
    B = events[index];
  }
  const distanceToB = Math.abs(B.time - timestamp);

  if (index === 0) {
    if (distanceToB < maxDistance) {
      return B;
    }
    return null;
  }

  const A = events[index - 1];
  const distanceToA = Math.abs(A.time - timestamp);

  if (distanceToA <= distanceToB && distanceToA <= maxDistance) {
    return A;
  } else if (distanceToB < distanceToA && distanceToB <= maxDistance) {
    return B;
  }

  return null;
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
      navParams.query.eventId = encodeURIComponent(event.get('id'));
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
        return decodeURIComponent(query.eventId);
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

export function getMaxSeverity(events) {
  let maxSeverity = 0;
  events.forEach(event => {
    const severity = event.getIn(['problem', 'severity'], 0);
    if (severity > maxSeverity) {
      maxSeverity = severity;
    }
  });
  return maxSeverity;
}

export function getColorForMostSevereEvents(events) {
  const maxSeverity = getMaxSeverity(events);
  return maxSeverity > 0 ? theme.health[maxSeverity] : '#6B8088';
}
