import {createLogger} from 'instalog';

import {createStore} from 'in-stores/store';
import http from 'in-services/http';

const logger = createLogger('in-stores/maintenance');

const store = createStore({
  name: 'maintenanceMessage',
  initialValue: null
});

export const maintenanceMessage$ = store.observable.distinct();

retrieveLatestMessage();
setInterval(retrieveLatestMessage, 1000 * 60 * 30);

function retrieveLatestMessage() {
  const observable = http({
    method: 'GET',
    url: '/notifications/maintenance.md',
    responseType: 'text'
  });

  observable.once(response => {
    const body = (response.body || '').trim();
    if (body.length === 0) {
      store.applyStateMutation(() => null);
    } else {
      store.applyStateMutation(() => body);
    }
  });

  observable.errors().once(err => {
    logger.warn('Failed to retrieve maintenance document', err);
  });
}


export function markAsRead() {
  store.applyStateMutation(() => null);
}
