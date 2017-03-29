import {createStore} from 'in-stores/store';


const devQuery = createStore({
  name: 'in-components/SearchBar/stores/devQuery',
  initialValue: ''
});
export const devQuery$ = devQuery.observable;

export function setDevQuery(newQuery) {
  devQuery.mutateTo(newQuery);
}
