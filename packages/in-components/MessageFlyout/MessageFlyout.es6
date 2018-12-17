import React, { Fragment } from 'react';

import { messages$ } from 'in-components/MessageFlyout/stores/messages';
import Message from 'in-components/MessageFlyout/Message';
import connectTo from 'in-hoc/connectTo';

import './MessageFlyout.less';

const block = 'in-message-flyout';

export default connectTo(
  {
    messages: messages$
  },
  function MessageFlyout({ messages }) {
    if (messages.length === 0) {
      return null;
    }

    //license usage message is treated differently then the rest of the messages
    const normalMessages = messages.filter(message => !message.isLicenseUsageMsg);

    return (
      <div className={block}>
        {normalMessages.length > 0 && (
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
