/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field } from 'formalistic';
import React from 'react';

import ValidationBlock from 'in-components/form/ValidationBlock';
import { Trans } from 'in-i18n';

// @ts-expect-error
import locals from './TouchedMessages.mless';

export interface TouchedMessagesProps {
  field?: Field<any>;
  className: string;
}

export default function TouchedMessages({ field, className }: TouchedMessagesProps) {
  if (!field?.hierarchyTouched) {
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
