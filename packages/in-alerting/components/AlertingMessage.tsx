/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Message, MessageTypes } from '@instana/components';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';

export default function AlertingMessage({ messages }: { messages: EnrichedError[] }) {
  if (messages?.length === 0 || !messages) {
    return null;
  }
  return (
    <>
      {messages.map((messages: EnrichedError) => {
        return (
          <Message
            type={messages?.level as MessageTypes}
            fullInlineWidth
            withIcon
            title={messages?.message as string}
          />
        );
      })}
    </>
  );
}
