import { createStore } from 'in-stores/store';

const sortByStore = createStore({
  name: 'eventView/sortByStore',
  initialValue: 'start'
});
export const sortBy$ = sortByStore.observable;

export function setSortBy(newSortBy) {
  sortByStore.mutateTo(newSortBy);
}
