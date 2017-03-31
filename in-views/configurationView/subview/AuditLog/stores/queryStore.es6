import { createStore } from 'in-stores/store';

const query = createStore({
  name: 'auditlog/queryStore',
  initialValue: ''
});
export const query$ = query.observable;

export function setQuery(_query) {
  query.mutateTo(_query);
}
