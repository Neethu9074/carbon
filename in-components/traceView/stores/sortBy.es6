import {createStore} from 'in-stores/store';

const sortByStore = createStore({
  name: 'in-components/traceView/stores/sortBy',
  initialValue: 'ts'
});
export const sortBy$ = sortByStore.observable;


export function setSortBy(newSortBy) {
  sortByStore.mutateTo(newSortBy);
}
