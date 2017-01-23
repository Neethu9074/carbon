import {
  setEventTypeFilter as setSearchEventTypeFilter,
  removeEventTypeFilter,
  containsEventTypeFilter
} from 'in-stores/search/events';
import {createTrackingStore} from 'in-stores/store';
import {rawQuery$} from 'in-stores/search/rawQuery';


export const eventFilter$ = createTrackingStore({
  name: 'eventView/eventFilterStore',
  observable: rawQuery$.map(query => {
    const filteredByEvents = containsEventTypeFilter(query, 'event');
    const filteredByIncidents = containsEventTypeFilter(query, 'incident');
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
    ? setSearchEventTypeFilter(_filter)
    : removeEventTypeFilter();
}
