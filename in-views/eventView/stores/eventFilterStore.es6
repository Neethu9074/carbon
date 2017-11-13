import { mutateUrl, viewPathParams$ } from 'in-stores/navigation';
import { createTrackingStore } from 'in-stores/store';

export const eventFilter$ = createTrackingStore({
  name: 'eventView/eventFilter',
  observable: viewPathParams$.map(config => config.params[0] || null).distinct()
}).observable;

export function setEventTypeFilter(filter) {
  mutateUrl(params => {
    if (filter) {
      params.pathname = `/events/@${filter}`;
    } else {
      params.pathname = '/events';
    }
    return params;
  });
}
