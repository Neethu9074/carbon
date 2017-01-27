import {createStore} from 'in-stores/store';

const sortDirectionStore = createStore({
  name: 'traceView/stores/sortDirection',
  initialValue: 'desc'
});
export const sortDirection$ = sortDirectionStore.observable;

export function setSortDirection(newSortDirection) {
  sortDirectionStore.mutateTo(newSortDirection);
}
