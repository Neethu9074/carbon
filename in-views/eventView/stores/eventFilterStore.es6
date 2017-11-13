import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { createTrackingStore } from 'in-stores/store';

export const eventFilter$ = createTrackingStore({
  name: 'eventView/eventFilter',
  observable: navigationParameters$
    .map(params => {
      const query = params.query;
      if ('eventType' in query) {
        return query.eventType;
      }
      return null;
    })
    .distinct()
}).observable;

export function setEventTypeFilter(filter) {
  mutateUrl(params => {
    if (filter) {
      params.query.eventType = filter;
    } else {
      delete params.query.eventType;
    }
    return params;
  });
}
