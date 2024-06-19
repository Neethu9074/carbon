/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

import { Message as CarbonMessage, MessageTypes } from '@instana/components';
import { Stack, SvgIcon } from '@instana/components';

import { carbonMessageEnabled } from 'in-services/featureFlags';

import locals from './Message.mless';

interface MessageParms {
  content: ReactNode;
  icon: string;
  onClick?: (e: React.MouseEvent) => {};
  title?: string;
  type: 'info' | 'warning' | 'danger';
}

interface MessageProps {
  message: MessageParms;
  carbonVariant: boolean;
}

interface TitleProps {
  title?: string;
}

interface ContentProps {
  content: ReactNode;
}

export default function Message({ message, carbonVariant }: MessageProps) {
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
  return carbonMessageEnabled || carbonVariant ? (
    <CarbonMessage
      className={locals.carbon}
      title={message.title}
      type={baseType}
      inline={false}
      dismissible
      onCloseButtonClick={message.onClick}
      carbonVariant
    >
      <div className={locals.carbonContent}>{message.content}</div>
    </CarbonMessage>
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={classNames({
        [locals.flyoutMessage]: true,
        [locals[message.type]]: message.type,
        [locals.clickable]: message.onClick
      })}
      onClick={message.onClick}
    >
      <Stack direction="horizontal" gap="xsmall">
        <SvgIcon type={message.icon} className={locals.icon} />
        <div
          className={classNames(locals.msg, {
            [locals.verticallyCenterMsg]: !message.title && typeof message.content === 'string'
          })}
        >
          <Title title={message.title} />
          {typeof message.content === 'string' ? <Content content={message.content} /> : message.content}
        </div>
      </Stack>
    </motion.div>
  );
}

function Title({ title }: TitleProps) {
  if (!title) {
    return null;
  }
  return (
    <div className={locals.title}>
      <strong>{title}</strong>
    </div>
  );
}

function Content({ content }: ContentProps) {
  return <div className={locals.content}>{content}</div>;
}
