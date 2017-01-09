import {createStore} from 'in-stores/store';

const expandedStore = createStore({
  name: 'search/expanded',
  initialValue: false
});

export const expanded$ = expandedStore.observable;

export function toggle() {
  expandedStore.applyStateMutation(expanded => !expanded);
}
