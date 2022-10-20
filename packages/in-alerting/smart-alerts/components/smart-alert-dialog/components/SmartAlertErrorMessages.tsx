/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Message, MessageTypes } from '@instana/components';

import { compareIgnoreCase } from 'in-services/util/string';

type MessageType = {
  message: string;

  /** @type: defaults to "error", if not set */
  level?: keyof typeof MessageTypes;
};

interface SmartAlertErrorMessagesProps {
  messages: MessageType[];
}

const withDefaultLevel = (m: MessageType) => ({
  ...m,
  level: m.level ?? 'error'
});

/**
 * Renders the messages, after grouping/sorting by level (reverse alphabetically! - so warning comes first)
 * @param messages
 * @constructor
 */
export const SmartAlertErrorMessages = ({ messages = [] }: SmartAlertErrorMessagesProps) => {
  return messages
    .map(withDefaultLevel)
    .sort((a, b) => -1 * compareIgnoreCase(a.level, b.level))
    .map((m, i) => <Message key={i} title={m.message} type={m.level} withIcon small />);
};
