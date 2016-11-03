import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import './Message.less';

const block = 'in-message-flyout-message';

export default function Message({message}) {
  let classes = `${block} ${block}--${message.type}`;
  if (message.onClick) {
    classes = `${classes} ${block}--clickable`;
  }

  return (
    <div className={classes}
         onClick={e => {
           e.preventDefault();
           e.stopPropagation();
           if (message.onClick) {
             message.onClick();
           }
         }}>
      <SvgIcon type={message.icon}
               className={`${block}__icon`}
               width={18}/>
      <div className={`${block}__content`}>
        {message.content}
      </div>
    </div>
  );
}
