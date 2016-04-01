import {mapHealthToColor, mapSeverityToHealth, health} from 'in-services/health';
import {historicalEvents$, openEvents$} from 'in-services/issueTracker';
import {alwaysNull} from 'in-services/fixedStreams';
import {createStore} from 'in-stores/store';


export const FILTER_TYPES = {
  ALL: {
    predicate: () => true,
    iconType: ''
  },
  CRITICAL: {
    predicate: event => mapSeverityToHealth(event.getIn(['problem', 'severity'])) === health.danger,
    color: mapHealthToColor(health.danger),
    iconType: 'critical'
  },
  WARNING: {
    predicate: event => mapSeverityToHealth(event.getIn(['problem', 'severity'])) === health.warning,
    color: mapHealthToColor(health.warning),
    iconType: 'warning'
  },
  CHANGE: {
    predicate: issue => mapSeverityToHealth(issue.getIn(['problem', 'severity'])) === health.ok,
    color: mapHealthToColor(health.ok),
    iconType: 'instana_change'
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

export const selectedEventList = selectedEventListStore.observable;

export function setSelectedList(type) {
  selectedEventListStore.applyStateMutation(() => type);
}

export const event$ = selectedEventListStore.observable
  .distinct()
  .flatMap(list => {
    switch (list) {
      case EVENT_LISTS.CURRENT:
        return openEvents$;
      case EVENT_LISTS.HISTORICAL:
        return historicalEvents$;
      default:
        return alwaysNull;
    }
});
