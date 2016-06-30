import {eventsInTimeframe$, openEventsAtServerTime$} from 'in-stores/events';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {mapHealthToColor, health} from 'in-services/health';
import {createStore} from 'in-stores/store';


export const FILTER_TYPES = {
  ALL: {
    predicate: () => true,
    iconType: ''
  },
  CRITICAL: {
    predicate: event => getEventType(event) === EVENT_TYPES.ISSUE_CRITICAL,
    color: mapHealthToColor(health.danger),
    iconType: 'critical'
  },
  WARNING: {
    predicate: event => getEventType(event) === EVENT_TYPES.ISSUE_WARNING,
    color: mapHealthToColor(health.warning),
    iconType: 'warning'
  },
  CHANGE: {
    predicate: event => getEventType(event) === EVENT_TYPES.CHANGE,
    color: mapHealthToColor(health.ok),
    iconType: 'instana_change'
  },
  INCIDENT: {
    predicate: event => getEventType(event) === EVENT_TYPES.INCIDENT,
    color: mapHealthToColor(health.ok),
    iconType: 'incidents'
  }
};

const selectedNotificationFilterStore = createStore({
  name: 'selectedNotificationFilter',
  initialValue: FILTER_TYPES.ALL
});

export const selectedNotificationFilter = selectedNotificationFilterStore.observable;

export function setSelectedNotificationFilter(filter) {
  selectedNotificationFilterStore.applyStateMutation(() => filter);
}


export const EVENT_LISTS = {
  CURRENT: 'current',
  HISTORICAL: 'historical'
};
const selectedEventListStore = createStore({
  name: 'selectedEventListStore',
  initialValue: EVENT_LISTS.CURRENT
});

export const selectedEventList$ = selectedEventListStore.observable;

export function setSelectedList(type) {
  selectedEventListStore.applyStateMutation(() => type);
}

export const event$ = selectedEventListStore.observable
  .distinct()
  .flatMap(list => {
    switch (list) {
      case EVENT_LISTS.CURRENT:
        return openEventsAtServerTime$;
      case EVENT_LISTS.HISTORICAL:
        return eventsInTimeframe$;
      default:
        throw new Error('Unsupported list type: ' + list);
    }
  })
  .map(events => {
    let result = [];

    result = result.concat(events.issues);
    result = result.concat(events.incidents);
    result = result.concat(events.changes);

    return result;
  });
