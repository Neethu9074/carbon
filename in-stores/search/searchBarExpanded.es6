import { navigationParameters$, mutateUrl } from 'in-stores/navigation';
import { query$ } from 'in-stores/search/query';
import { createStore } from 'in-stores/store';

const expandedStore = createStore({
  name: 'search/searchBarExpanded',
  initialVlaue: false
});
export const expanded$ = expandedStore.observable;

export function toggle() {
  mutateUrl(params => {
    if (params.query.ss === '1') {
      delete params.query.ss;
      expandedStore.mutateTo(false);
    } else {
      params.query.ss = '1';
      expandedStore.mutateTo({
        expandedByUser: true
      });
    }
  });
}

// if the searchbar was expanded by a user action and not the url,
// the input field will autofocus
export function open(expandedByUser = true) {
  mutateUrl(params => {
    params.query.ss = '1';
    expandedStore.mutateTo({
      expandedByUser
    });
  });
}

export function init() {
  query$.skipFirst().subscribe(() => open(false));

  navigationParameters$.once(params => {
    if (params.query.ss === '1') {
      open(false);
    }
  });
}
