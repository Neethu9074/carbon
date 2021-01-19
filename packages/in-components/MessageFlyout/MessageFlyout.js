/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { messages$ } from 'in-components/MessageFlyout/stores/messages';
import UsageMessage from 'in-components/MessageFlyout/UsageMessage';
import Message from 'in-components/MessageFlyout/Message';
import connectTo from 'in-hoc/connectTo';

import './MessageFlyout.less';

const block = 'in-message-flyout';

export default connectTo(
  {
    messages: messages$
  },
  function MessageFlyout({ messages, filterRegularMessages }) {
    if (!messages || messages.length === 0) {
      return null;
    }

    //license usage message is treated differently then the rest of the messages
    const usageMessage = messages.filter(message => message.isLicenseUsageMsg);
    const normalMessages = messages.filter(message => !message.isLicenseUsageMsg);

    return (
      <div className={block}>
        {usageMessage.length > 0 && (
          <Fragment>
            {usageMessage.map(message => (
              <UsageMessage key={message.id} message={message} />
            ))}
          </Fragment>
        )}

        {normalMessages.length > 0 && !filterRegularMessages && (
          <Fragment>
            {normalMessages.map(message => (
              <Message key={message.id} message={message} />
            ))}
          </Fragment>
        )}
      </div>
    );
  }
);
