// @flow

import getClientMessages from 'in-subscription/getClientMessages';
import type { Message } from 'in-subscription/getClientMessages';
import { isTechnicalError } from 'in-types/error';
import { createStore } from 'in-stores/store';
import { createLogger } from 'instalog';

const logger = createLogger('MessageDialogStores');

const messageStore = createStore({
  name: 'messages'
});

export const message$ = messageStore.observable;

export function clearMessage() {
  messageStore.mutateTo(null);
}

export function init() {
  getClientMessages().subscribe(onNewMessage);
}

function onNewMessage(msg: Message) {
  if (isTechnicalError(msg.errorCode)) {
    logger.error('Technical error received from backend', msg);
  } else {
    messageStore.mutateTo(msg);
  }
}
