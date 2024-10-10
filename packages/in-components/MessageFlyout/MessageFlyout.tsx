/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { messages$ } from 'in-components/MessageFlyout/stores/messages';
import Message from 'in-components/MessageFlyout/Message';

import locals from './MessageFlyout.mless';

interface MessageFlyoutProps {
  onlyShowUsageRelatedMessages?: boolean;
}

export default function MessageFlyout(props: MessageFlyoutProps) {
  const { onlyShowUsageRelatedMessages } = props;
  const messages = useObservable(messages$, []);

  if (!messages?.length) {
    return null;
  }

  return (
    <div className={locals.flyout}>
      {!onlyShowUsageRelatedMessages &&
        messages
          .filter(message => !message.isLicenseUsageMsg)
          .map(message => <Message key={message.id} message={message} />)}
    </div>
  );
}
