import {navigationParameters$, mutateUrl} from 'in-stores/navigation';
import {createTrackingStore} from 'in-stores/store';


export const expanded$ = createTrackingStore({
  name: 'search/expanded',
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
