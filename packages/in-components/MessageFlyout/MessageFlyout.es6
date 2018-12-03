import React from 'react';

import { messages$ } from 'in-components/MessageFlyout/stores/messages';
import Message from 'in-components/MessageFlyout/Message';
import UsageMessage from 'in-components/MessageFlyout/UsageMessage';
import connectTo from 'in-hoc/connectTo';

import './MessageFlyout.less';

const block = 'in-message-flyout';
const usageBlock = 'in-message-flyout-usage';

export default connectTo(
  {
    messages: messages$
  },
  function MessageFlyout({ messages }) {
    if (messages.length === 0) {
      return null;
    }

    if (messages.find(message => message.isLicenseUsageMsg) != null) {
      return (
        <div className={usageBlock}>
          {messages.map(message => (
            <UsageMessage key={message.id} message={message} />
          ))}
        </div>
      );
    }

    return (
      <div className={block}>
        {messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
      </div>
    );
  }
);
