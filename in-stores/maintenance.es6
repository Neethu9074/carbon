import {combineLatest} from 'reactive-observables';
import {createLogger} from 'instalog';

import {isOnPremise} from 'in-services/config';
import {createStore} from 'in-stores/store';
import http from 'in-services/http';

const logger = createLogger('in-stores/maintenance');

const readStateStore = createStore({
  name: 'maintenanceMessageRead',
  initialValue: false
});

const store = createStore({
  name: 'maintenanceMessage',
  initialValue: null
});

export const maintenanceMessage$ = combineLatest([readStateStore.observable, store.observable])
  .map(([readState, maintenanceMessage]) => {
    if (readState) {
      return null;
    }

    return maintenanceMessage;
  })
  .distinct();

if (!isOnPremise()) {
  retrieveLatestMessage();
  setInterval(retrieveLatestMessage, 1000 * 60 * 10);
}

function retrieveLatestMessage() {
  const observable = http({
    method: 'GET',
    url: '/notifications/maintenance.md?cacheBust=' + Date.now(),
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
  readStateStore.applyStateMutation(() => true);
}
