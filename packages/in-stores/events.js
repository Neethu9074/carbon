/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Map } from 'immutable';
import { get } from 'lodash';

import createTotalRawEventsSubscription from 'in-subscription/totalRawEventsCount';
import createHealthInfoSubscription from 'in-subscription/healthInfo';
import createEventObservable from 'in-subscription/event';
import { emptyList } from 'in-services/fixedImmutables';
import { alwaysNull } from 'in-services/fixedStreams';
import { timeConfig$ } from 'in-stores/time/config';
import { createStore } from 'in-stores/store';
import theme from 'in-themes';
import { t } from 'in-i18n';

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
    timeConfig: { to: null, windowSize: 1 }
  }).subscribe(result => openEventsAtServerTime.mutateTo(result));
}

export function getHealthInfoAtFocusedMoment(snapshotId) {
  return getHealthInfo(snapshotId);
}

export function getHealthInfo(snapshotId, timeConfig) {
  if (timeConfig == null) {
    return timeConfig$.flatMap(timeConfig =>
      createHealthInfoSubscription({ timeConfig, snapshotId })
        // We are not transferring empty health info objects from backend => UI.
        // Instead, we assume that the typical case is that an entity has no issue
        // and therefore we immediately start this observable with an ok-state.
        .startWith(noProblemsHealthInfo)
    );
  }

  return (
    createHealthInfoSubscription({ timeConfig, snapshotId })
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
  return getHealthInfoAtFocusedMoment(snapshotId).flatMap(healthInfo => {
    const eventWithMaxSeverity = healthInfo.get('eventWithMaxSeverity');
    return eventWithMaxSeverity ? getEvent(healthInfo.get('eventWithMaxSeverity')) : alwaysNull;
  });
}

export function fireCallbacksForEventAtFocusedMomentAsStream(event, ifOpen, ifClosed) {
  const start = event.get('start');
  const end = event.get('end');
  const state = event.get('state');
  const severity = event.getIn(['problem', 'severity'], 0);

  return timeConfig$
    .map(timeConfig => {
      if (isEventOpenAtFocusedMoment(start, end, state, timeConfig)) {
        return ifOpen({ event, severity, timeConfig });
      }
      return ifClosed({ event, severity, timeConfig });
    })
    .distinct();
}

export function isEventOpenAtFocusedMoment(start, end, state, timeConfig) {
  // We must believe in state == open and should not use the focused moment to compare
  // against start and end (even when not in live mode) as processing lags may
  // cause the end date to be inaccurate.
  if (state === 'open') {
    return true;
  }

  // live mode, state == closed which always means false
  if (timeConfig.focusedMoment == null) {
    return false;
  }

  return start <= timeConfig.focusedMoment && timeConfig.focusedMoment < end;
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

export function getColor({ event, timeConfig, defaultColor }) {
  const isImmutableObject = !!event.get;
  const severity = isImmutableObject
    ? event.getIn(['problem', 'severity'], 0)
    : get(event, ['problem', 'severity'], event.severity || 0);
  const start = isImmutableObject ? event.get('start') : event.start;
  const end = isImmutableObject ? event.get('end') : event.end;
  const state = isImmutableObject ? event.get('state') : event.state;
  const color = getColorBySeverity(severity, { defaultColor });

  if (isEventOpenAtFocusedMoment(start, end, state, timeConfig)) {
    return color;
  }
  return getColorBySeverity(0, { defaultColor });
}

export function getColorForEventAtFocusedMomentAsStream(event, params) {
  return timeConfig$.map(timeConfig => getColor({ event, timeConfig, ...params }));
}

export const healthColors = [
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
  if (severity <= 0 && params.defaultColor) {
    return params.defaultColor;
  }
  return healthColors[Math.max(0, severity) | 0];
}

export function getDesignLibraryColorBySeverity(severity, fallback = '#92A5AE') {
  if (severity > 5) {
    return theme.lib.colors.failure;
  } else if (severity > 0) {
    return theme.lib.colors.warning;
  }
  return fallback;
}

export function getButtonKindBySeverity(severity, fallback = 'secondary') {
  if (severity > 5) {
    return 'danger';
  } else if (severity > 0) {
    return 'warning';
  }
  return fallback;
}

export const EVENT_TYPES = {
  CHANGE: 0,
  ISSUE_WARNING: 1,
  ISSUE_CRITICAL: 2,
  ISSUE_OK: 3,
  INCIDENT: 4
};

export function getIcon({ event, eventType }) {
  if (!eventType) {
    eventType = getEventType(event);
  }
  switch (eventType) {
    case EVENT_TYPES.ISSUE_WARNING:
      return 'lib_events_warning';
    case EVENT_TYPES.ISSUE_CRITICAL:
      return 'lib_events_critical';
    case EVENT_TYPES.INCIDENT:
      return 'lib_events_incident';
    default:
      return 'lib_events_change';
  }
}

export function getEventSeverityLabel(event) {
  const isImmutableObject = !!event.get;
  const severity = isImmutableObject
    ? event.getIn(['problem', 'severity'], 0)
    : get(event, ['problem', 'severity'], event.severity || 0);
  switch (severity) {
    case 5:
      return t('in-events:labelWarning');
    case 10:
      return t('in-events:labelCritical');
    default:
      return '';
  }
}

export function getEventSeverityLabelWithEventType(event) {
  const isImmutableObject = !!event.get;
  const eventType = isImmutableObject ? event.get('type') : event.type;
  const eventTitle = isImmutableObject ? event.get('title') : event.title;
  const problemText = isImmutableObject
    ? event.getIn(['problem', 'problemText'])
    : get(event, ['problem', 'problemText'], '');
  const severityLabel = getEventSeverityLabel(event);
  switch (eventType) {
    case 'incident':
      return t('in-events:labelIncidentWithSeverity', { severityLabel });
    case 'issue':
      return t('in-events:labelIssueWithSeverity', { severityLabel });
    case 'change':
      if (eventTitle === 'offline' || problemText === 'offline') {
        return t('in-events:labelOffline');
      } else if (eventTitle === 'online' || problemText === 'online') {
        return t('in-events:labelOnline');
      } else {
        return t('in-events:labelChange');
      }
    default:
      return severityLabel;
  }
}

export function getEventType(event) {
  const isImmutableObject = !!event.get;
  const eventType = isImmutableObject ? event.get('type') : event.type;
  switch (eventType) {
    case 'incident':
      return EVENT_TYPES.INCIDENT;
    case 'change':
      return EVENT_TYPES.CHANGE;
    case 'issue': {
      const severity = isImmutableObject
        ? event.getIn(['problem', 'severity'], 0)
        : get(event, ['problem', 'severity'], event.severity || 0);
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
