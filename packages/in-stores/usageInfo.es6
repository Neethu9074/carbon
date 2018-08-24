/* eslint-disable react/no-danger */
import { combineLatest } from 'reactive-observables';
import React from 'react';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { isUsageInfoPopupEnabled } from 'in-services/featureFlags';
import { reportLicenseType } from 'in-services/tracking/appcues';
import { toHtml } from 'in-services/formatters/markdown';
import getUsageInfo from 'in-subscription/getUsageInfo';
import { createStore } from 'in-stores/store';

const messageId = 'usageInfo';

const usageInfoVisibleStore = createStore({
  name: 'usageInfo/usageInfoVisible',
  initialValue: true
});
const usageInfoVisible$ = usageInfoVisibleStore.observable;

export function hideUsageInfo() {
  usageInfoVisibleStore.mutateTo(false);
}

export function init() {
  combineLatest([getUsageInfo(), usageInfoVisible$]).subscribe(([usageInfo, visible]) => {
    if (usageInfo == null) {
      removeMessage(messageId);
      return;
    }

    if (usageInfo.activeLicenseType) {
      reportLicenseType(usageInfo.activeLicenseType);
    }

    if (!visible || usageInfo.type === 'OK' || !isUsageInfoPopupEnabled) {
      removeMessage(messageId);
      return;
    }

    addMessage(
      {
        type: usageInfo.type.toLowerCase(),
        icon: 'info',
        content: <DangerousHtmlPresenter html={toHtml(usageInfo.note)} />,
        onClick: hideUsageInfo
      },
      messageId
    );
  });
}
