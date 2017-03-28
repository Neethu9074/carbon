import {createStore} from 'in-stores/store';


const query = createStore({
  name: 'SearchBar/stores/query',
  initialValue: ''
});

export const query$ = query.observable;

export function setQuery(_query) {
  query.mutateTo(_query);
}
