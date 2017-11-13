import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { createTrackingStore } from 'in-stores/store';

export const eventFilter$ = createTrackingStore({
  name: 'eventView/eventFilter',
  observable: navigationParameters$
    .map(params => {
      if (params.pathname.indexOf('/events/') === 0) {
        const subView = params.pathname.split('/events/').filter(s => s.length > 0);
        if (subView.length > 0) {
          return subView[subView.length - 1];
        }
      }
      return null;
    })
    .distinct()
}).observable;

export function setEventTypeFilter(filter) {
  mutateUrl(params => {
    if (filter) {
      params.pathname = `/events/${filter}`;
    } else {
      params.pathname = '/events';
    }
    return params;
  });
}
