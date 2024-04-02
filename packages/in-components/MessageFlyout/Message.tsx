/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

import { Message as BaseMessage, MessageTypes } from '@instana/components';

import locals from './Message.mless';

interface Message {
  content: ReactNode;
  icon: string;
  onClick?: (e: React.MouseEvent) => {};
  title?: string;
  type: 'info' | 'warning' | 'danger';
}

interface MessageProps {
  message: Message;
}

// TODO: remember to uncomment inline option once the Message feature merged
export default function MessageLocal({ message }: MessageProps) {
  let baseType;
  switch (message.type) {
    case 'warning':
      baseType = MessageTypes.warning;
      break;
    case 'danger':
      baseType = MessageTypes.error;
      break;
    default:
      baseType = MessageTypes.neutral;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={classNames({
        [locals.flyoutMessage]: true,
        [locals.clickable]: message.onClick
      })}
      onClick={message.onClick}
    >
      <BaseMessage /*inline={false}*/ title={message.title} type={baseType}>
        {message.content}
      </BaseMessage>
    </motion.div>
  );
}
