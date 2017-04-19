import createEventObservable from 'in-services/subscription/event';
import { focusEvent } from 'in-stores/navigation/view';
import { clearSelectedEvent } from 'in-stores/events';

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

export function selectEvent(event) {
  focusEvent(event.get('id'));
}

export function clearEvent() {
  clearSelectedEvent();
}

export function getEvent(eventId) {
  return createEventObservable({ eventId });
}
