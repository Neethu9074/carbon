/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable react/no-danger */
import React from 'react';

import { combineLatest } from '@instana/observables';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
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
  combineLatest([getUsageInfo(), usageInfoVisible$]).subscribe(([usageInfo]) => {
    if (usageInfo == null) {
      removeMessage(messageId);
      return;
    }

    addMessage(
      {
        type: usageInfo.type.toLowerCase(),
        icon: 'info',
        content: (
          <DangerousHtmlPresenter html={toHtml(filterContentIfNotOnprem(usageInfo.note, usageInfo.remainingDays))} />
        ),
        onClick: hideUsageInfo,
        isLicenseUsageMsg: true,
        activeLicense: usageInfo.activeLicenseType,
        latestExpiredLicenseType: usageInfo.latestExpiredLicenseType,
        remainingDays: usageInfo.remainingDays,
        expiryDate: usageInfo.expiryDate
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
function filterContentIfNotOnprem(msg, remainingDays) {
  if (!onPremLicenseInformationEnabled) {
    if (msg == '') {
      return 'Your license expires in ' + remainingDays + ' days';
    }
    if (msg.indexOf('(s)') === -1) {
      return msg.replace(/\*/g, '');
    }
    return msg.replace(/\*/g, '').substring(0, msg.indexOf('(s)') + 3) + '!';
  } else {
    return msg;
  }
}
