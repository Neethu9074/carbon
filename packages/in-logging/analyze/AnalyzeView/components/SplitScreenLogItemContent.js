/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { formatDateTime } from 'in-services/formatters/date';
import KeyValue from 'in-new-components/lists/KeyValue';

export default function SplitScreenLogItemContent({ log: { content, timestamp } }) {
  return (
    <KeyValue
      label={<time dateTime={new Date(timestamp).toISOString()}>{formatDateTime(timestamp)}</time>}
      value={content}
      inverted
      accentuated
    />
  );
}
