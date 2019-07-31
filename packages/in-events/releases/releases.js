import React from 'react';

import getReleaseNotification from 'in-events/subscriptions/getReleaseNotification';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import ReleaseOccurredMessage from './ReleaseOccuredMessage';
import { releasesEnabled } from 'in-services/featureFlags';

export function init() {
  if (!releasesEnabled) return;

  getReleaseNotification()
    .map(({ data }) => data)
    .filter(Boolean)
    .map(getPushMessageConfig)
    .subscribe(onReleaseEvent);
}

function getPushMessageConfig(latestRelease) {
  return {
    message: {
      type: 'info',
      content: <ReleaseOccurredMessage release={latestRelease} />
    },
    id: latestRelease.id
  };
}

function onReleaseEvent({ message, id }) {
  addMessage(message, id);
}
