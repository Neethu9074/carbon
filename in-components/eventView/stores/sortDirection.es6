import {createStore} from 'in-stores/store';


const sortDirectionStore = createStore({
  name: 'eventView/sortDirection',
  initialValue: 'asc'
});
export const sortDirection$ = sortDirectionStore.observable;

export function setSortDirection(newSortDirection) {
  sortDirectionStore.mutateTo(newSortDirection);
}
