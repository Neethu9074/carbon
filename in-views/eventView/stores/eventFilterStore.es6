import { setKeyword, removeKeyword, containsKeyword } from 'in-stores/search/keywords';
import { createTrackingStore } from 'in-stores/store';
import { query$ } from 'in-stores/search/query';

export const eventFilter$ = createTrackingStore({
  name: 'eventView/eventFilterStore',
  observable: query$.map(query => {
    const filteredByEvents = containsKeyword(query, 'event.type', 'event');
    const filteredByIncidents = containsKeyword(query, 'event.type', 'incident');
    const filteredByObjectives = containsKeyword(query, 'event.type', 'objectiveViolation');
    if (filteredByEvents && filteredByIncidents && filteredByObjectives) {
      return null;
    } else if (filteredByIncidents) {
      return 'incident';
    } else if (filteredByObjectives) {
      return 'objectiveViolation';
    } else if (filteredByEvents) {
      return 'event';
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
