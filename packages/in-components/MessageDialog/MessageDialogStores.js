// @flow

import { getInitializationCallStack, getSubscriptionPayload } from 'in-connection';
import getClientMessages from 'in-subscription/getClientMessages';
import type { Message } from 'in-subscription/getClientMessages';
import { isTechnicalError } from 'in-services/util/error';
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
    const args = [
      'Technical error received from backend',
      msg,
      getInitializationCallStack(msg.subscriptionId),
      {
        subscriptionPayload: getSubscriptionPayload(msg.subscriptionId)
      }
    ].filter(Boolean);
    logger.error(...args);
  } else {
    messageStore.mutateTo(msg);
  }
}
