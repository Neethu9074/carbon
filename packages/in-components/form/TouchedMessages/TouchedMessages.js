import React from 'react';

import ValidationBlock from 'in-components/form/ValidationBlock';

import locals from './TouchedMessages.mless';

export default function TouchedMessages({ field, className }) {
  if (!field?.touched) {
    return null;
  }

  return field.messages.map((message, i) => (
    <ValidationBlock key={i} className={className}>
      {message.message}{' '}
      {message.path && (
        <>
          (at <code className={locals.path}>{message.path}</code>)
        </>
      )}
    </ValidationBlock>
  ));
}
