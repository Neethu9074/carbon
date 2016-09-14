import createEventObservable from 'in-services/subscription/event';
import {selectEvent as selectEventInStore} from 'in-stores/events';
import {mapSeverityToHealth, health} from 'in-services/health';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import {setSelectedIncident} from 'in-stores/incident';
import {theme} from 'in-services/theme';


export const EVENT_TYPES = {
  CHANGE: 0,
  ISSUE_WARNING: 1,
  ISSUE_CRITICAL: 2,
  ISSUE_OK: 3,
  INCIDENT: 4
};

/**
 * Gets the color for an event. If an event is closed it should be some kind
 * grey, if it's open and critical it has a danger color and so on.
 *
 */
export function getColorForEvent(event) {
  if (event.get('state') === 'open') {
    const severity = event.getIn(['problem', 'severity'], 0);

    const color = theme.health[severity];
    if (!color) {
      return theme.health[0];
    }
    return color;
  }

  return theme.health[0];
}

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
    default:
      return useAlternativeChangeIcon ? 'instana_change' : 'change';
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
    case 'change':
      return EVENT_TYPES.CHANGE;
    case 'issue':
      const eventHealth = mapSeverityToHealth(event.getIn(['problem', 'severity']));
      if (eventHealth === health.warning) {
        return EVENT_TYPES.ISSUE_WARNING;
      } else if (eventHealth === health.danger) {
        return EVENT_TYPES.ISSUE_CRITICAL;
      }
      return EVENT_TYPES.ISSUE_OK;
    default:
      return EVENT_TYPES.CHANGE;
  }
}


export function selectEvent(event) {
  selectEventInStore(event);

  if (getEventType(event) === EVENT_TYPES.INCIDENT) {
    setSelectedIncident(event.get('id'));
  } else {
    setSelectedSnapshotId(event.getIn(['problem', 'snapshotId']));
  }
}

export function getEvent(eventId) {
  return createEventObservable({eventId});
}
