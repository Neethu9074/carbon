/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Trans } from 'in-i18n';
import React from 'react';

import ValidationBlock from 'in-components/form/ValidationBlock';

import locals from './TouchedMessages.mless';

export default function TouchedMessages({ field, className }) {
  if (!field?.touched) {
    return null;
  }

  return field.messages.map((message, i) => {
    if (message.path) {
      return (
        <ValidationBlock key={i} className={className}>
          {message.path ? (
            <Trans
              i18nKey="in-components:touchedMessages.withPath"
              values={{ message: message.message, path: message.path }}
              components={{
                codeWithClass: <code className={locals.path} />
              }}
            />
          ) : (
            message.message
          )}
        </ValidationBlock>
      );
    } else {
      return (
        <ValidationBlock key={i} className={className}>
          {message.message}
        </ValidationBlock>
      );
    }
  });
}
