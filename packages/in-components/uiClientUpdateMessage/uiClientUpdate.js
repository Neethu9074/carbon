/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import UiCLientUpdateMessage from 'in-components/uiClientUpdateMessage/UiClientUpdateMessage';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { uiNeedsRefresh$ } from 'in-services/uiClientVersion';
import { t } from 'in-i18n';

export function init() {
  uiNeedsRefresh$.subscribe(uiNeedsRefresh => {
    if (!uiNeedsRefresh) return;

    addMessage(
      {
        title: t('in-components:uiClinetUpdateMessage.newVersionOfInstanaAvailable'),
        type: 'info',
        icon: 'info',
        content: <UiCLientUpdateMessage />
      },
      'ui-update-notification'
    );
  });
}
