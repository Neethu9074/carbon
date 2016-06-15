import {createStore} from 'in-stores/store';

const queryStore = createStore({
  name: 'tableView/search',
  initialValue: ''
});

export const query$ = queryStore.observable.distinct();

export function setQuery(query) {
  queryStore.applyStateMutation(() => query);
}
