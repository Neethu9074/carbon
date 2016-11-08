import {combineLatest} from 'reactive-observables';
import React from 'react';

import {addMessage, removeMessage} from 'in-components/MessageFlyout/stores/messages';
import {toHtml} from 'in-services/formatters/markdown';
import {isOnPremise} from 'in-services/config';
import {createStore} from 'in-stores/store';
import {getIn} from 'in-services/settings';
import http from 'in-services/http';

const messageId = 'maintenanceNote';

const messageStore = createStore({
  name: 'in-stores/maintenance/message',
  initialValue: null
});
const message$ = messageStore.observable.distinct();


const messageReadStore = createStore({
  name: 'in-stores/maintenance/messageRead',
  initialValue: false
});
const messageRead$ = messageReadStore.observable;

function markAsRead() {
  messageReadStore.mutateTo(true);
}


export function init() {
  if (!isOnPremise()) {
    retrieveLatestMessage();
    setInterval(retrieveLatestMessage, 1000 * 60 * 10);

    combineLatest([message$, messageRead$, getIn(['showMaintenanceNotes'])])
      .subscribe(([message, messageRead, showMaintenanceNotes]) => {
        const hasContent = message != null && message.trim().length > 0;
        if (!hasContent || messageRead || !showMaintenanceNotes) {
          removeMessage(messageId);
        } else if (hasContent) {
          addMessage(
            {
              type: 'info',
              icon: 'server',
              content: <div dangerouslySetInnerHTML={{__html: toHtml(message)}} />,
              onClick: markAsRead
            },
            messageId
          );
        }
      });
  }
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
      messageStore.applyStateMutation(() => null);
    } else {
      messageStore.applyStateMutation(() => body);
    }
  });

  observable.errors().once(() => {
    // ignore HTTP errors as the system will self heal and there is no reason to notify
    // us about these types of errors.
  });
}
