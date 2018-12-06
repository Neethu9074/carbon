import React, { Fragment } from 'react';

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

    //license usage message is treated differently then the rest of the messages
    const usageMessage = messages.filter(message => message.isLicenseUsageMsg);
    const normalMessages = messages.filter(message => !message.isLicenseUsageMsg);

    return (
      <Fragment>
        {usageMessage.length > 0 && (
          <div className={usageBlock}>
            {usageMessage.map(message => (
              <UsageMessage key={message.id} message={message} />
            ))}
          </div>
        )}

        {normalMessages.length > 0 && (
          <div className={block}>
            {normalMessages.map(message => (
              <Message key={message.id} message={message} />
            ))}
          </div>
        )}
      </Fragment>
    );
  }
);
