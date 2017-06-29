import { setKeyword, removeKeyword, containsKeyword } from 'in-stores/search/keywords';
import { createTrackingStore } from 'in-stores/store';
import { query$ } from 'in-stores/search/query';

export const eventFilter$ = createTrackingStore({
  name: 'eventView/eventFilterStore',
  observable: query$.map(query => {
    const filteredByIssues = containsKeyword(query, 'event.type', 'issue');
    const filteredByChanges = containsKeyword(query, 'event.type', 'change');
    const filteredByIncidents = containsKeyword(query, 'event.type', 'incident');
    const filteredByObjectives = containsKeyword(query, 'event.type', 'objectiveViolation');
    if (filteredByIssues && filteredByChanges && filteredByIncidents && filteredByObjectives) {
      return null;
    } else if (filteredByIncidents) {
      return 'incident';
    } else if (filteredByObjectives) {
      return 'objectiveViolation';
    } else if (filteredByIssues) {
      return 'issue';
    } else if (filteredByChanges) {
      return 'change';
    }
    return null;
  })
}).observable;

export function setEventTypeFilter(filter) {
  if (filter) {
    setKeyword('event.type', filter);
  } else {
    removeKeyword('event.type');
  }
}
