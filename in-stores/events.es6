import { Map } from 'immutable';

import { setHighlightedEntityId, clearHighlightedEntityId } from 'in-services/stores/highlightedEntityId';
import createTotalRawEventsSubscription from 'in-services/subscription/totalRawEventsCount';
import createHealthInfoSubscription from 'in-services/subscription/healthInfo';
import createEventObservable from 'in-services/subscription/event';
import { createStore, createTrackingStore } from 'in-stores/store';
import { navigationParameters$ } from 'in-stores/navigation';
import { emptyList } from 'in-services/fixedImmutables';
import { alwaysNull } from 'in-services/fixedStreams';
import { focusedMoment$ } from 'in-stores/timeline';

const noProblemsHealthInfo = Map({
  maxSeverity: 0,
  numberOfOpenEvents: 0,
  eventWithMaxSeverity: null,
  eventIds: emptyList
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

export function getHealthInfoAtFocusedMoment(snapshotId) {
  return focusedMoment$.flatMap(_focusedMoment =>
    createHealthInfoSubscription({ focusedMoment: _focusedMoment, snapshotId })
      // We are not transferring empty health info objects from backend => UI.
      // Instead, we assume that the typical case is that an entity has no issue
      // and therefore we immediately start this observable with an ok-state.
      .startWith(noProblemsHealthInfo)
  );
}

export function getEvent(eventId) {
  return createEventObservable({ eventId });
}

/**
 * Searches for the issue with the highest severity and returns it or the first
 * if many have the same severity
 *
 * @param {number} snapshotId The id to filter the event stream
 * @returns {Observable<Event>} The event with the highest severity
 */
export function getMostImportantEventAtFocusedMoment(snapshotId) {
  return getHealthInfoAtFocusedMoment(snapshotId).flatMap(healthInfo =>
    getEvent(healthInfo.get('eventWithMaxSeverity'))
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
export const EVENT_TYPES = {
  CHANGE: 0,
  ISSUE_WARNING: 1,
  ISSUE_CRITICAL: 2,
  ISSUE_OK: 3,
  INCIDENT: 4,
  OBJECTIVE: 5
};

/**
 * Gets the icontype, needed for Icon components for an events type.
 *
 * @param {EVENT_TYPES} eventType The event type for which the icon type should be determined.
 * @returns {string} The icon type of the event
 */
export function getIconTypeForEventType(eventType, useAlternativeChangeIcon) {
  switch (eventType) {
    case EVENT_TYPES.ISSUE_WARNING:
      return 'warning';
    case EVENT_TYPES.ISSUE_CRITICAL:
      return 'critical';
    case EVENT_TYPES.INCIDENT:
      return 'incidents';
    case EVENT_TYPES.OBJECTIVE:
      return 'objectives';
    default:
      return useAlternativeChangeIcon ? 'change2' : 'change';
  }
}

/**
 * Gets the icontype, needed for Icon components for an event.
 *
 * @param {Immutable<Event>} event The event for which the icon type should be determined.
 * @returns {string} The icon type of the event
 */
export function getIconTypeForEvent(event, useAlternativeChangeIcon = false) {
  return getIconTypeForEventType(getEventType(event, useAlternativeChangeIcon));
}

export function getEventType(event) {
  const eventType = event.get('type');
  switch (eventType) {
    case 'incident':
      return EVENT_TYPES.INCIDENT;
    case 'objective':
      return EVENT_TYPES.OBJECTIVE;
    case 'change':
      return EVENT_TYPES.CHANGE;
    case 'issue': {
      const severity = event.getIn(['problem', 'severity'], 0);
      if (severity > 8) {
        return EVENT_TYPES.ISSUE_CRITICAL;
      } else if (severity > 4) {
        return EVENT_TYPES.ISSUE_WARNING;
      }
      return EVENT_TYPES.ISSUE_OK;
    }
    default:
      return EVENT_TYPES.CHANGE;
  }
}
