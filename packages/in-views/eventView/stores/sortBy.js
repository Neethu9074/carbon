import { toggleSortDirection, setSortDirection } from 'in-views/eventView/stores/sortDirection';
import { createStore } from 'in-stores/store';

const sortByStore = createStore({
  name: 'eventView/sortByStore',
  initialValue: 'start'
});
export const sortBy$ = sortByStore.observable;

export function setSortBy(newSortBy) {
  sortByStore.applyStateMutation(oldSortBy => {
    if (oldSortBy === newSortBy) {
      toggleSortDirection();
    } else {
      setSortDirection('desc');
    }
    return newSortBy;
  });
}
