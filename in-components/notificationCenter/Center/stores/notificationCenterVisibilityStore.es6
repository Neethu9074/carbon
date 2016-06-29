import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import {createTrackingStore} from 'in-stores/store';


export const isOpen$ = createTrackingStore({
  name: 'NotificationCenter/visibilityStore',
  observable: navigationParameters$
    .map(params => 'event_center' in params.query)
    .distinct()
}).observable;

export function toggle() {
  mutateUrl(params => {
    if ('event_center' in params.query) {
      delete params.query.event_center;
    } else {
      params.query.event_center = 'true';
    }
    return params;
  });
}

export function open() {
  mutateUrl(params => {
    params.query.event_center = 'true';
    return params;
  });
}

export function close() {
  mutateUrl(params => {
    delete params.query.event_center;
    return params;
  });
}
