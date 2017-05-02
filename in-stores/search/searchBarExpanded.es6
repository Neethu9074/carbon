import { navigationParameters$, mutateUrl } from 'in-stores/navigation';
import { createTrackingStore } from 'in-stores/store';
import { query$ } from 'in-stores/search/query';

export const expanded$ = createTrackingStore({
  name: 'search/searchBarExpanded',
  observable: navigationParameters$
    // ss === show search
    .map(params => params.query.ss === '1')
    .distinct()
}).observable;

export function toggle() {
  mutateUrl(params => {
    if (params.query.ss === '1') {
      delete params.query.ss;
    } else {
      params.query.ss = '1';
    }
  });
}

export function open() {
  mutateUrl(params => {
    params.query.ss = '1';
  });
}

export function init() {
  query$.skipFirst().subscribe(open);
}
