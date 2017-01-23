import {createStore} from 'in-stores/store';

const sortByStore = createStore({
  name: 'traceView/stores/sortBy',
  initialValue: 'ts'
});
export const sortBy$ = sortByStore.observable;


export function setSortBy(newSortBy) {
  sortByStore.mutateTo(newSortBy);
}
