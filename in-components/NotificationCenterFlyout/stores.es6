import {mapHealthToColor, mapSeverityToHealth, health} from 'in-services/health';
import {createStore} from 'in-stores/store';


export const FILTER_TYPES = {
  ALL: {
    predicate: () => true,
    iconType: ''
  },

  CRITICAL: {
    predicate: issue => mapSeverityToHealth(issue.getIn(['problem', 'severity'])) === health.danger,
    color: mapHealthToColor(health.danger),
    iconType: 'critical'
  },

  WARNING: {
    predicate: issue => mapSeverityToHealth(issue.getIn(['problem', 'severity'])) === health.warning,
    color: mapHealthToColor(health.warning),
    iconType: 'warning'
  },

  SYSTEM: {
    predicate: issue => mapSeverityToHealth(issue.getIn(['problem', 'severity'])) === health.ok,
    color: mapHealthToColor(health.ok),
    iconType: 'system'
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
