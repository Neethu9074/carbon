import {mapHealthToColor, mapSeverityToHealth, health} from 'in-services/health';
import {historicalIssues$, openIssues$} from 'in-services/issueTracker';
import {alwaysNull} from 'in-services/fixedStreams';
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


export const ISSUE_LISTS = {
  CURRENT: 'current',
  HISTORICAL: 'historical'
};
const selectedIssueListStore = createStore({
  name: 'selectedIssueList',
  initialValue: ISSUE_LISTS.CURRENT
});

export const Issue$ = selectedIssueListStore.observable
  .distinct()
  .flatMap(list => {
    switch (list) {
      case ISSUE_LISTS.CURRENT:
        return openIssues$;
      case ISSUE_LISTS.HISTORICAL:
        return historicalIssues$;
      default:
        return alwaysNull;
    }
});

export const selectedIssueList = selectedIssueListStore.observable;

export function setSelectedList(type) {
  selectedIssueListStore.applyStateMutation(() => type);
}
