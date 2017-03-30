import {createStore} from 'in-stores/store';


const devQuery = createStore({
  name: 'in-components/SearchBar/stores/devQuery',
  initialValue: 'memory:123 AND span.type:"lala"'
});
export const devQuery$ = devQuery.observable;

export function setDevQuery(newQuery) {
  devQuery.mutateTo(newQuery);
}
