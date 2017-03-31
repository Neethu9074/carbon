import React from 'react';

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

    return (
      <div className={block}>
        {messages.map(message => <Message key={message.id} message={message} />)}
      </div>
    );
  }
);
