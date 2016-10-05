import {setEventTypeFilter as setSearchEventTypeFilter} from 'in-stores/search/events';
import {createStore} from 'in-stores/store';


const eventFilter = createStore({
  name: 'eventView/eventFilterStore',
  initialValue: null
});
export const eventFilter$ = eventFilter.observable;

// set incident as initial filter
// setEventTypeFilter('incident');


export function setEventTypeFilter(_filter) {
  eventFilter.mutateTo(_filter);
  setSearchEventTypeFilter(_filter);
}
