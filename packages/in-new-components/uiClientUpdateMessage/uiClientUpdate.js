/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import UiCLientUpdateMessage from 'in-new-components/uiClientUpdateMessage/UiClientUpdateMessage';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { uiNeedsRefresh$ } from 'in-services/uiClientVersion';

export function init() {
  uiNeedsRefresh$.subscribe(uiNeedsRefresh => {
    if (!uiNeedsRefresh) return;

    addMessage(
      {
        type: 'info',
        icon: 'info',
        content: <UiCLientUpdateMessage />
      },
      'ui-update-notification'
    );
  });
}
