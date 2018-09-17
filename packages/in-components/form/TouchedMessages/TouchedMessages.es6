import React from 'react';

import ValidationBlock from 'in-components/form/ValidationBlock';

export default function TouchedMessages({ field, className }) {
  if (!field.touched) {
    return null;
  }

  return field.messages.map((message, i) => (
    <ValidationBlock key={i} className={className}>
      {message.message}
    </ValidationBlock>
  ));
}
