/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

import { Stack, SvgIcon } from '@instana/components';

// @ts-expect-error
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

interface TitleProps {
  title?: string;
}

interface ContentProps {
  content: ReactNode;
}

export default function Message({ message }: MessageProps) {
  return (
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
