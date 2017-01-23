import {
  setTypeFilter,
  removeTypeFilter,
  containsTypeFilter
} from 'in-stores/search/keywords/type';
import {createTrackingStore} from 'in-stores/store';
import {query$} from 'in-stores/search/query';


export const eventFilter$ = createTrackingStore({
  name: 'eventView/eventFilterStore',
  observable: query$.map(query => {
    const filteredByEvents = containsTypeFilter(query, 'event');
    const filteredByIncidents = containsTypeFilter(query, 'incident');
    if (filteredByEvents && filteredByIncidents) {
      return null;
    } else if (filteredByIncidents) {
      return 'incident';
    } else if (filteredByEvents) {
      return 'event';
    }
    return null;
  })
}).observable;

export function setEventTypeFilter(_filter) {
  _filter
    ? setTypeFilter(_filter)
    : removeTypeFilter();
}
