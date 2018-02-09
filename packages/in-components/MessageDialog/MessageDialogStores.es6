/* eslint-disable no-console */

import createMessageObservable from 'in-subscription/message';
import { isInstanaEngineer } from 'in-stores/user';
import { createStore } from 'in-stores/store';

/*
*/
const messageStore = createStore({
  name: 'messageStore',
  initialValue: null
});

export const message$ = messageStore.observable;

export function clearMessage() {
  messageStore.applyStateMutation(() => null);
}

export function init() {
  createMessageObservable().subscribe(msg => {
    if (msg.errorCode === 'CLIENT' || msg.errorCode === 'SERVER') {
      if (isInstanaEngineer) {
        console.error(msg);
      }
    } else {
      messageStore.applyStateMutation(() => msg);
    }
  });
}
