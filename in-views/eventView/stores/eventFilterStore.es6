import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { createTrackingStore } from 'in-stores/store';

export const eventFilter$ = createTrackingStore({
  name: 'eventView/eventFilter',
  observable: navigationParameters$.map(params => params.matrix.view || null).distinct()
}).observable;

export function setEventTypeFilter(filter) {
  mutateUrl(params => {
    if (filter) {
      params.matrix.view = filter;
    } else {
      delete params.matrix.view;
    }
    return params;
  });
}
