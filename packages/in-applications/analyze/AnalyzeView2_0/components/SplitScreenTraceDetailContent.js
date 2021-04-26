/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { formatDateTime } from 'in-services/formatters/date';
import { latencyFixed } from 'in-services/formatters/number';
import KeyValue from 'in-new-components/lists/KeyValue';

const typePerDataSource = {
  calls: 'call',
  traces: 'trace'
};

export default function SplitScreenTraceDetailContent({ dataSource, ungroupedViewConfiguration, ...props }) {
  const item = props[typePerDataSource[dataSource]];
  const { label, duration } = item;
  const timestamp = item[ungroupedViewConfiguration.timestampName];
  return (
    <KeyValue
      value={label}
      label={
        <>
          <time dateTime={new Date(timestamp).toISOString()}>{formatDateTime(timestamp)}</time> &nbsp;{'  '}
          {latencyFixed.compact(duration)}
        </>
      }
      inverted
      accentuated
    />
  );
}
