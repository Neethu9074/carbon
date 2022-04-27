/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Item } from 'formalistic';
import React from 'react';

import ValidationBlock from 'in-components/form/ValidationBlock';
import { Trans } from 'in-i18n';

import locals from './TouchedMessages.mless';

export interface TouchedMessagesProps {
  field?: Item;
  className?: string;
}

export default function TouchedMessages({ field, className }: TouchedMessagesProps) {
  if (!field?.hierarchyTouched) {
    return null;
  }

  /*
   Wrapping it into a fragment, to avoid this TS error
   TS2786: Its return type 'Element[]' is not a valid JSX element.
   */
  return (
    <>
      {field.messages.map((message, i) => {
        if (message.path) {
          return (
            <ValidationBlock key={i} className={className ?? ''}>
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
            <ValidationBlock key={i} className={className ?? ''}>
              {message.message}
            </ValidationBlock>
          );
        }
      })}
    </>
  );
}
