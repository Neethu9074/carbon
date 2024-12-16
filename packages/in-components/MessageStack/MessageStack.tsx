/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Message } from '@instana/components';

import { compareIgnoreCase } from 'in-services/util/string';
import { ErrorCode } from 'in-types';

export type MessageType = {
  message: string;
  level?: 'warning' | 'error';
  code?: ErrorCode;
};

interface MessageStackProps {
  className?: string;
  messages: MessageType[];
}

const withDefaultLevel = (m: MessageType) => ({
  ...m,
  level: m.level ?? 'error'
});

/**
 * Renders the messages block, after grouping/sorting by level (reverse alphabetically! - so warning comes first)
 * If no messages exist, there won't be anything rendered to avoid adding any empty spacer.
 */
export default function MessageStack({ className, messages = [] }: MessageStackProps) {
  if (messages.length == 0) return null;
  return (
    <div className={className}>
      {messages
        .map(withDefaultLevel)
        .sort((a, b) => -1 * compareIgnoreCase(a.level, b.level))
        .map((m, i) => (
          <Message key={i} title={m.message} type={m.level} withIcon small fullInlineWidth />
        ))}
    </div>
  );
}
