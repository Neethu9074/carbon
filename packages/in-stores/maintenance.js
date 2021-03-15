/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';
import React from 'react';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { maintenanceNotesEnabled } from 'in-services/featureFlags';
import { tryGet, trySet } from 'in-services/localStorage';
import { toHtml } from 'in-services/formatters/markdown';
import { getSetting$ } from 'in-services/settings';
import { instanaRegion } from 'in-services/config';
import { hours, minutes } from 'in-services/time';
import { createStore } from 'in-stores/store';
import http from 'in-services/http';

const messageId = 'maintenanceNote';
const localStorageKey = 'maintenanceNote.lastViewedTimestamp';
const maxTimeToStoreInLocalStorage = hours.toMillis(2);

const messageStore = createStore({
  name: 'maintenance/message',
  initialValue: null
});
const message$ = messageStore.observable.distinct();

const messageReadStore = createStore({
  name: 'maintenance/messageRead',
  initialValue: Date.now() - Number(tryGet(localStorageKey)) < maxTimeToStoreInLocalStorage
});

const messageRead$ = messageReadStore.observable;

function markAsRead() {
  trySet(localStorageKey, Date.now());
  messageReadStore.mutateTo(true);
}

export function init() {
  if (maintenanceNotesEnabled) {
    retrieveLatestMessage();
    setInterval(retrieveLatestMessage, minutes.toMillis(10));

    combineLatest([message$, messageRead$, getSetting$('showMaintenanceNotes')]).subscribe(
      ([message, messageRead, showMaintenanceNotes]) => {
        const hasContent = message != null && message.trim().length > 0;
        if (!hasContent || messageRead || !showMaintenanceNotes) {
          removeMessage(messageId);
        } else if (hasContent) {
          addMessage(
            {
              type: 'info',
              icon: 'server',
              content: <DangerousHtmlPresenter html={toHtml(message)} />,
              onClick(e) {
                if (!e.target || e.target.tagName !== 'A') {
                  // The maintenance info popup contains a clickable link.
                  // In these cases we want the click to normally open the link
                  // without any side-effects.
                  markAsRead();
                }
              }
            },
            messageId
          );
        }
      }
    );
  }
}

function retrieveLatestMessage() {
  let path;
  if (instanaRegion) {
    path = `/notifications/maintenance/${instanaRegion}.md`;
  } else {
    path = '/notifications/maintenance.md';
  }

  const observable = http({
    method: 'GET',
    maxRetries: 3,
    url: `${path}?cacheBust=${Date.now()}`,
    responseType: 'text'
  });

  observable.once(
    response => {
      const body = (response.body || '').trim();
      if (body.length === 0) {
        messageStore.mutateTo(null);
      } else {
        messageStore.mutateTo(body);
      }
    },
    () => {
      // ignore HTTP errors as the system will self heal and there is no reason to notify
      // us about these types of errors.
    }
  );
}
