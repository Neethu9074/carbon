import React from 'react';

import './Message.less';

const block = 'in-message-flyout-message';

export default function Message({message}) {
  let classes = `${block} ${block}--${message.type}`;
  if (message.onClick) {
    classes = `${classes} ${block}--clickable`;
  }

  return (
    <div className={classes}
         onClick={message.onClick}>
      {message.content}
    </div>
  );
}
