import { toggleSortDirection, setSortDirection } from 'in-views/traceView/stores/sortDirection';
import { createStore } from 'in-stores/store';

const sortByStore = createStore({
  name: 'traceView/stores/sortBy',
  initialValue: 'ts'
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
