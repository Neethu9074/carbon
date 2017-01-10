import {expanded$} from 'in-stores/search/expanded';
import {createStore} from 'in-stores/store';

const visibilityStore = createStore({
  name: 'in-components/SearchBar/stores/menuVisibility',
  initialValue: false
});

export const visible$ = visibilityStore.observable;

export function toggle() {
  visibilityStore.applyStateMutation(visible => !visible);
}

// force hide the menu when the whole search bar is hidden
expanded$.subscribe(expanded => {
  if (!expanded) {
    visibilityStore.mutateTo(false);
  }
});
