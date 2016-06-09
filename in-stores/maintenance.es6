import {combineLatest} from 'reactive-observables';

import {isOnPremise} from 'in-services/config';
import {createStore} from 'in-stores/store';
import http from 'in-services/http';

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

  observable.errors().once(() => {
    // ignore HTTP errors as the system will self heal and there is no reason to notify
    // us about these types of errors.
  });
}


export function markAsRead() {
  readStateStore.applyStateMutation(() => true);
}
