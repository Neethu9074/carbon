/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';
import { Map } from 'immutable';
import { get } from 'lodash';

import { themes } from '@instana/design-tokens';

import { productCode, productCodeType, productPlatformTitle, productTitle, ut30 } from 'in-services/util/constants';
// eslint-disable-next-line no-restricted-imports
import { carbonAlert } from 'in-themes/chartColors';
import createTotalRawEventsSubscription from 'in-subscription/totalRawEventsCount';
import { getLicenseTypeForSegment } from 'in-services/util/segmentLicenseType';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createHealthInfoSubscription from 'in-subscription/healthInfo';
import { customRealmName } from 'in-services/util/constants';
import createEventObservable from 'in-subscription/event';
import { emptyList } from 'in-services/fixedImmutables';
import { alwaysNull } from 'in-services/fixedStreams';
import { timeConfig$ } from 'in-stores/time/config';
import { createStore } from 'in-stores/store';
import { config } from 'in-services/config';
import { user } from 'in-stores/user';
import http from 'in-services/http';
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
  if (!eventId) {
    return alwaysNull;
  }
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
  const isImmutableObject = !!event.get;
  const start = isImmutableObject ? event.get('start') : event.start;
  const end = isImmutableObject ? event.get('end') : event.end;
  const state = isImmutableObject ? event.get('state') : event.state;
  const severity = isImmutableObject
    ? event.getIn(['problem', 'severity'], 0)
    : get(event, ['problem', 'problemText'], '');
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
  const isCVEEvent = isImmutableObject ? event.getIn(['metadata', 'cve']) : event.metadata?.cve;

  let color;
  if (isCVEEvent) {
    const severity = isImmutableObject
      ? event.getIn(['metadata', 'cve', 'severity'], '')
      : get(event, ['metadata', 'cve', 'severity'], event.metadata.cve?.severity || '');
    color = getColorBySeverity(severity, { defaultColor, isCVE: true });
  } else {
    const severity = isImmutableObject
      ? event.getIn(['problem', 'severity'], 0)
      : get(event, ['problem', 'severity'], event.severity || 0);
    color = getColorBySeverity(severity, { defaultColor });
  }
  const start = isImmutableObject ? event.get('start') : event.start;
  const end = isImmutableObject ? event.get('end') : event.end;
  const state = isImmutableObject ? event.get('state') : event.state;

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
  '#FFC600',
  '#ffde00',
  '#ffbf08',
  '#ffa010',
  '#ff8019',
  '#ff6121',
  '#ff4229'
];

export function getColorBySeverity(severity, params = {}) {
  if (params.isCVE) {
    const cveSeverityMap = {
      Low: carbonAlert.yellow30,
      Warning: carbonAlert.orange40,
      Critical: carbonAlert.red60
    };
    return cveSeverityMap[severity] || params.defaultColor;
  }
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

// Depending on the severity level, return the proper icon associated
export function getDesignLibrarySeverityIcon(severity) {
  return severity > 5 ? 'lib_help_error_error_circle' : 'lib_help_error_warning';
}

export function getDesignLibraryColorBySeverity(severity, fallback = '#92A5AE') {
  if (severity > 5) {
    return themes.default.ids.color.option.red['500'];
  } else if (severity > 0) {
    return themes.default.ids.color.option.yellow['500'];
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
  INCIDENT: 4,
  CVE_ISSUE: 5,
  AGENT_MONITORING_ISSUE: 6,
  PRC_ISSUE: 7
};

export function getIcon(eventType) {
  switch (eventType) {
    case EVENT_TYPES.ISSUE_WARNING:
      return 'lib_events_warning';
    case EVENT_TYPES.ISSUE_CRITICAL:
      return 'lib_events_critical';
    case EVENT_TYPES.INCIDENT:
      return 'lib_events_incident';
    case EVENT_TYPES.CVE_ISSUE:
      return 'lib_events_cve';
    default:
      return 'lib_events_change';
  }
}

export function getEventSeverityLabel(event) {
  const isImmutableObject = !!event.get;
  const eventType = isImmutableObject
    ? event.getIn(['problem', 'type'], '')
    : get(event, ['problem', 'type'], event.type || '');

  let severity;
  if (eventType === 'cve_issue') {
    severity = isImmutableObject
      ? event.getIn(['metadata', 'cve', 'severity'], '')
      : get(event, ['metadata', 'cve', 'severity'], event.metadata?.cve.severity || '');
  } else {
    severity = isImmutableObject
      ? event.getIn(['problem', 'severity'], 0)
      : get(event, ['problem', 'severity'], event.severity || 0);
  }

  if (eventType === 'cve_issue') {
    switch (severity) {
      case 'Critical':
        return t('in-events:labelCritical');
      case 'Warning':
        return t('in-events:labelWarning');
      case 'Low':
        return t('in-events:labelLow');
      default:
        return '';
    }
  } else {
    switch (severity) {
      case 5:
        return t('in-events:labelWarning');
      case 10:
        return t('in-events:labelCritical');
      default:
        return '';
    }
  }
}

export function getEventStateLabel(event, timeConfig) {
  const start = event.get?.('start') ?? event.start;
  const end = event.get?.('end') ?? event.end;
  const state = event.get?.('state') ?? event.state;

  if (isEventOpenAtFocusedMoment(start, end, state, timeConfig)) {
    return t('in-events:labelOpen');
  }

  return t('in-events:labelClosed');
}

export function getEventSeverityLabelWithEventType(event, timeConfig) {
  const isImmutableObject = !!event.get;
  const eventType = isImmutableObject ? event.get('type') : event.type;
  const eventTitle = isImmutableObject ? event.get('title') : event.title;
  const problemText = isImmutableObject
    ? event.getIn(['problem', 'problemText'])
    : get(event, ['problem', 'problemText'], '');
  const severityLabel = getEventSeverityLabel(event);
  const stateLabel = getEventStateLabel(event, timeConfig);
  switch (eventType) {
    case 'incident':
      return t('in-events:labelIncidentWithSeverity', {
        severityLabel: severityLabel,
        stateLabel: stateLabel
      });
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
    case 'agent_monitoring_issue': // can be handled just as any other issue in the UI
      return EVENT_TYPES.AGENT_MONITORING_ISSUE;
    case 'cve_issue':
      return EVENT_TYPES.CVE_ISSUE;
    case 'prc_issue':
      return EVENT_TYPES.PRC_ISSUE;
    case 'issue': {
      const severity = isImmutableObject
        ? event.getIn(['problem', 'severity'], 0)
        : get(event, ['problem', 'severity'], event.severity || 0);
      if (severity >= 10) {
        return EVENT_TYPES.ISSUE_CRITICAL;
      }
      return EVENT_TYPES.ISSUE_WARNING;
    }
    default:
      return EVENT_TYPES.CHANGE;
  }
}

export function getEventTrackingType(event) {
  const isImmutableObject = !!event.get;
  const eventType = isImmutableObject ? event.get('type') : event.type;
  return getParentPage(eventType);
}

export function getParentPage(eventType) {
  switch (eventType) {
    case 'incident':
      return 'Incident';
    case 'change':
      return 'Change';
    case 'agent_monitoring_issue': // can be handled just as any other issue in the UI
      return 'Agent Monitoring Issue';
    case 'cve_issue':
      return 'CVE Issue';
    case 'prc_issue':
      return 'PRC Issue';
    case 'issue':
      return 'Issue';
    default:
      return 'All';
  }
}

export function annotateEvent(note) {
  const obj = http({
    method: 'PUT',
    maxRetries: 3,
    url: '/api/notes/annotate-event',
    headers: getCsrfHeader(),
    data: {
      parent: note.incidentId,
      timestamp: Date.now(),
      type: 'note',
      author: note.author,
      authorId: note.authorId,
      action: note.action,
      contents: (note.contents && note.contents.trim()) || undefined,
      currentId: note.currentId || undefined,
      metadata: note.metadata || undefined
    }
  });
  return obj.map(response => fromJS(response.body)).once();
}

// Trigger an ai summary generation for the particular noteID
export function generateJournalSummary(incidentId) {
  const obj = http({
    method: 'POST',
    maxRetries: 3,
    url: `/api/journal/ai-summary/${incidentId}`,
    headers: getCsrfHeader()
  });
  return obj.map(response => fromJS(response.body)).once();
}

export function shareEventSummary(incidentId, recipients, timestamp, sender, subject, body, link) {
  const obj = http({
    method: 'POST',
    maxRetries: 3,
    url: `/api/journal/ai-summary/${incidentId}/share-result`,
    headers: getCsrfHeader(),
    data: {
      recipients: recipients,
      timestamp: timestamp,
      sender: sender,
      subject: subject,
      content: body,
      link: link
    }
  });
  return obj.map(response => response.body);
}

export function eventsPageTracker(productArea, pageRootName, location, event, referrer) {
  let incidentData = undefined;
  let configType = event?.getIn(['metadata', 'eventConfigurationType']);
  const hasRca = event?.getIn(['metadata', 'rootCause', 'found']) === true;
  const hasRelatedEvents = event?.get('recentEvents')?.size > 1;
  const eventId = event?.get('id');

  // annotations specific to incidents (whether the incident has RCA/Related Events)
  if (hasRca || hasRelatedEvents) {
    incidentData = hasRca ? 'rca ' : '';
    incidentData = hasRelatedEvents ? incidentData + 'relatedEvents ' : incidentData;
    incidentData = incidentData.trimEnd();
  }

  // add config type category for agent monitoring issues and CVE issues (these are handled differently than other events)
  if (configType === undefined) {
    if (event?.getIn(['metadata', 'agent_monitoring_issue']) === true) {
      configType = 'Agent Monitoring Issue';
    } else if (event?.getIn(['metadata', 'cve_issue']) === true) configType = 'CVE Issue';
  }

  if (!window.analytics) {
    return;
  }

  const url = window.location.href;
  const { tenantUnitId, tenantId, tenantUnit, tenant, activeLicenseType } = config;
  if (!tenantUnitId) {
    return;
  }

  const path = location.pathname;
  const userSelfDefinedRole =
    window.instana?.termsAndPrivacySettings?.dynamicRole || window.instana?.termsAndPrivacySettings?.role;
  const productPlanType = getLicenseTypeForSegment(activeLicenseType);
  const userId = customRealmName + '-' + user?.id;
  window.analytics.page('Page Viewed', {
    UT30: ut30,
    instanceId: tenantUnitId,
    instanceName: tenantUnit,
    tenantId: tenantId,
    tenantName: tenant,
    parentPageCategory: productArea,
    parentPageName: pageRootName,
    eventId: eventId,
    data: incidentData,
    category: configType,
    path: path,
    productCode: productCode,
    productCodeType: productCodeType,
    productPlanType: productPlanType,
    productTitle: productTitle,
    url: url,
    altUserId: userId,
    platformTitle: productPlatformTitle,
    referrer: referrer,
    roles: [userSelfDefinedRole],
    'user.bluemixId': userId
  });

  return null; // SegmentEventTracker does not render anything
}
