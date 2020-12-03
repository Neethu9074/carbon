import React from 'react';

import { formatDateTime } from 'in-services/formatters/date';
import KeyValue from 'in-new-components/lists/KeyValue';

export default function SplitScreenLogItemContent({ log: { strippedContent, timestamp } }) {
  return (
    <KeyValue
      label={<time dateTime={new Date(timestamp).toISOString()}>{formatDateTime(timestamp)}</time>}
      value={strippedContent}
      inverted
      accentuated
    />
  );
}
