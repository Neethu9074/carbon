/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { formatDateTime } from 'in-services/formatters/date';
import { latencyFixed } from 'in-services/formatters/number';
import KeyValue from 'in-new-components/lists/KeyValue';

export default function SplitScreenPageLoadContent(props) {
  const {
    beacon: { websiteLabel, timestamp, duration }
  } = props;
  const formattedDuration = latencyFixed.compact(duration);
  return (
    <KeyValue
      label={
        <>
          {/* Todo */}
          <time dateTime={new Date(timestamp).toISOString()}>{formatDateTime(timestamp)}</time> &nbsp;{'  '}
          {formattedDuration}
        </>
      }
      value={websiteLabel}
      inverted
      accentuated
    />
  );
}
