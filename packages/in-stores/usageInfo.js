/* eslint-disable react/no-danger */
import { combineLatest } from '@instana/observables';
import React from 'react';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
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
        content: <DangerousHtmlPresenter html={toHtml(filterContentIfNotOnprem(usageInfo.note))} />,
        onClick: hideUsageInfo,
        isLicenseUsageMsg: true
      },
      messageId
    );
  });
}

/**
 * if we are in onpremise, we will not show the button to request a quote. We then show
 * the complete message we got from the backend. On saas however, we only use the first part of the message.
 * The second part is being replaced by the button to request a quote.
 *
 * @param msg
 * @returns {*}
 */
function filterContentIfNotOnprem(msg) {
  if (!onPremLicenseInformationEnabled) {
    if (msg.indexOf('(s)') === -1) {
      return msg.replace(/\*/g, '');
    }
    return msg.replace(/\*/g, '').substring(0, msg.indexOf('(s)') + 3) + '!';
  } else {
    return msg;
  }
}
