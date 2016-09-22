import {createStore} from 'in-stores/store';

const eventFilter = createStore({
  name: 'eventView/eventFilterStore',
  initialValue: 'incidents'
});
export const eventFilter$ = eventFilter.observable;


export function setEventFilter(newSortBy) {
  console.log('TODO: translate to lucene query');
  eventFilter.mutateTo(newSortBy);
}
