/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { messages$ } from 'in-components/MessageFlyout/stores/messages';
import UsageMessage from 'in-components/MessageFlyout/UsageMessage';
import Message from 'in-components/MessageFlyout/Message';

import locals from './MessageFlyout.mless';

export default function MessageFlyout({ onlyShowUsageRelatedMessages }) {
  const messages = useObservable(messages$, []);

  if (!messages?.length) {
    return null;
  }

  return (
    <div className={locals.flyout}>
      {messages
        .filter(message => message.isLicenseUsageMsg)
        .map(message => (
          <UsageMessage key={message.id} message={message} />
        ))}

      {!onlyShowUsageRelatedMessages &&
        messages
          .filter(message => !message.isLicenseUsageMsg)
          .map(message => <Message key={message.id} message={message} />)}
    </div>
  );
}
