/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createStore } from 'in-stores/store';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';

const messageId = 'errorBoundary-uncaught-error';

const store = createStore({
  name: 'errorBoundary/errorCount',
  initialValue: 0,
  reducers: {
    set(current, next) {
      return next;
    }
  }
});

export const errorCount$ = store.observable.distinct();

export function set(count) {
  store.applyStateMutation({ type: 'set', count });
}

export function init() {
  errorCount$.subscribe(count => {
    if (count < 1) {
      removeMessage(messageId);
    } else {
      addMessage(
        {
          type: 'danger',
          title: 'Error occurred',
          content: 'A part of the Instana UI could not be enabled due to an unexpected error.',
          timeout: 5000
        },
        messageId
      );
    }
  });
}
