import {setEventTypeFilter as setSearchEventTypeFilter, containsEventTypeFilter} from 'in-stores/search/events';
import {createTrackingStore} from 'in-stores/store';
import {rawQuery$} from 'in-stores/search';


export const eventFilter$ = createTrackingStore({
  name: 'eventView/eventFilterStore',
  observable: rawQuery$.map(query => {
    if (containsEventTypeFilter(query, 'incident')) {
      return 'incident';
    } else if (containsEventTypeFilter(query, 'issue')) {
      return 'issue';
    }
    return null;
  })
}).observable;

export function setEventTypeFilter(_filter) {
  setSearchEventTypeFilter(_filter);
}
