/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { messages$ } from 'in-components/MessageFlyout/stores/messages';
import MessageLocal from 'in-components/MessageFlyout/Message';

import locals from './MessageFlyout.mless';

export default function MessageFlyout({ onlyShowUsageRelatedMessages }) {
  const messages = useObservable(messages$, []);

  if (!messages?.length) {
    return null;
  }

  return (
    <div className={locals.flyout}>
      {!onlyShowUsageRelatedMessages &&
        messages
          .filter(message => !message.isLicenseUsageMsg)
          .map(message => <MessageLocal key={message.id} message={message} />)}
    </div>
  );
}
