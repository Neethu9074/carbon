import React from 'react';

import TemporaryPresenter from 'in-components/TemporaryPresenter';
import Message from 'in-new-components/Message';

export default function TemporaryMessage({ text, type, duration = 5000 }) {
  return (
    <TemporaryPresenter duration={duration} id={text}>
      <Message type={type} withIcon small>
        {text}
      </Message>
    </TemporaryPresenter>
  );
}
