import { expanded$ } from 'in-stores/search/searchBarExpanded';
import { createStore } from 'in-stores/store';

const visibilityStore = createStore({
  name: 'SearchBar/stores/presetsVisibility',
  initialValue: false
});

export const presetsVisible$ = visibilityStore.observable;

export function togglePresets() {
  visibilityStore.applyStateMutation(visible => !visible);
}

// force hide the menu when the whole search bar is hidden
expanded$.subscribe(expanded => {
  if (!expanded) {
    visibilityStore.mutateTo(false);
  }
});
