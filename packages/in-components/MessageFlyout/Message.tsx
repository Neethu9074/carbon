/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Message as CarbonMessage, MessageTypes } from '@instana/components';

import { MessageWithId } from 'in-components/MessageFlyout/stores/messages';

import locals from './Message.mless';

interface MessageProps {
  message: MessageWithId;
}

export default function Message({ message }: MessageProps) {
  let baseType;
  switch (message.type) {
    case 'warning':
      baseType = MessageTypes.warning;
      break;
    case 'danger':
      baseType = MessageTypes.error;
      break;
    case 'success':
      baseType = MessageTypes.success;
      break;
    default:
      baseType = MessageTypes.neutral;
  }
  return (
    <CarbonMessage
      className={locals.carbon}
      title={message.title}
      type={baseType}
      inline={false}
      dismissible
      onClose={message.onClick}
    >
      <div className={locals.carbonContent}>{message.content}</div>
    </CarbonMessage>
  );
}
