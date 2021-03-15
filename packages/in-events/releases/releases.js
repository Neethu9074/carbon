/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getReleaseNotification from 'in-events/subscriptions/getReleaseNotification';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import ReleaseOccurredMessage from './ReleaseOccuredMessage';

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
      type: 'info',
      content: <ReleaseOccurredMessage release={releaseNotification} />
    }
  };
}

function onReleaseNotification({ message }) {
  addMessage(message, 'release-notification-id');
}
