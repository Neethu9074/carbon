import React from 'react';

import ValidationBlock from 'in-components/form/ValidationBlock';

export default function TouchedMessages({ field }) {
  if (!field.touched) {
    return null;
  }

  return field.messages.map((message, i) => (
    <ValidationBlock hasError key={i}>
      {message.message}
    </ValidationBlock>
  ));
}
