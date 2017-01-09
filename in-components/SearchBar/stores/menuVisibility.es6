import {createStore} from 'in-stores/store';

const visibilityStore = createStore({
  name: 'in-components/SearchBar/stores/menuVisibility',
  initialValue: false
});

export const visible$ = visibilityStore.observable;

export function toggle() {
  visibilityStore.applyStateMutation(visible => !visible);
}
