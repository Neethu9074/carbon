/* eslint-disable react/no-danger */
import { combineLatest } from 'reactive-observables';
import React from 'react';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import createUsageInfoSubscription from 'in-subscription/usageInfo';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { createTrackingStore, createStore } from 'in-stores/store';
import { toHtml } from 'in-services/formatters/markdown';

const messageId = 'usageInfo';

const usageInfo$ = createTrackingStore({
  name: 'usageInfo/usageInfo',
  observable: createUsageInfoSubscription()
}).observable;

const usageInfoVisibleStore = createStore({
  name: 'usageInfo/usageInfoVisible',
  initialValue: true
});
const usageInfoVisible$ = usageInfoVisibleStore.observable;

export function hideUsageInfo() {
  usageInfoVisibleStore.mutateTo(false);
}

export function init() {
  // deactivate usage info handling in dev mode for some peace of mind
  if (__DEV__) {
    return;
  }

  combineLatest([usageInfo$, usageInfoVisible$]).subscribe(([usageInfo, visible]) => {
    if (usageInfo == null || !visible) {
      removeMessage(messageId);
    } else if (usageInfo) {
      addMessage(
        {
          type: usageInfo.get('type'),
          icon: 'info',
          content: <DangerousHtmlPresenter html={toHtml(usageInfo.get('note'))} />,
          onClick: hideUsageInfo
        },
        messageId
      );
    }
  });
}
