import React from 'react';

import { error } from 'in-new-components/Message/types';
import Message from 'in-new-components/Message';

export default function ErroneousTraceIndicator() {
  return <Message type={error} title="Erroneous Trace" />;
}
