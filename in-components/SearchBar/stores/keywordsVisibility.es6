import {expanded$} from 'in-stores/search/searchBarExpanded';
import {createStore} from 'in-stores/store';

const visibilityStore = createStore({
  name: 'SearchBar/stores/keywordsVisibility',
  initialValue: false
});

export const keywordsVisible$ = visibilityStore.observable;

export function toggleKeywords() {
  visibilityStore.applyStateMutation(visible => !visible);
}

// force hide the menu when the whole search bar is hidden
expanded$.subscribe(expanded => {
  if (!expanded) {
    visibilityStore.mutateTo(false);
  }
});
