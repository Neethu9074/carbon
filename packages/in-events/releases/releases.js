/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getReleaseNotification from 'in-events/subscriptions/getReleaseNotification';
import ReleaseOccurredMessage from 'in-events/releases/ReleaseOccuredMessage';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { t } from 'in-i18n';

export function init() {
  getReleaseNotification()
    .map(({ data }) => data)
    .filter(Boolean)
    .map(getPushMessageConfig)
    .subscribe(onReleaseNotification);
}

function getPushMessageConfig(releaseNotification) {
  return {
    message: {
      id: releaseNotification.id,
      type: 'info',
      title: t('in-events:titleReleaseOccurred'),
      content: <ReleaseOccurredMessage release={releaseNotification} />
    }
  };
}

function onReleaseNotification({ message }) {
  addMessage(message, message.id);
}
