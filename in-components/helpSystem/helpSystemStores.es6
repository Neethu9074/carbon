import { navigationParameters$ } from 'in-stores/navigation';
import { createTrackingStore } from 'in-stores/store';

export const helpId$ = createTrackingStore({
  name: 'helpId',
  observable: navigationParameters$
    .map(params => {
      const query = params.query;
      if ('help' in query) {
        return decodeURIComponent(query.help);
      }

      return null;
    })
    .distinct()
}).observable;
