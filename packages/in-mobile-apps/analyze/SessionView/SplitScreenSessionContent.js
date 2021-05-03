/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KeyValue } from '@instana/components';

import { formatDateTime } from 'in-services/formatters/date';
import { latencyFixed } from 'in-services/formatters/number';

export default function SplitScreenSessionContent(props) {
  const { beacon, dataSource } = props;
  const { timestamp, duration } = beacon;
  const formattedDuration = latencyFixed.compact(duration);
  return (
    <KeyValue
      label={
        <>
          <time dateTime={new Date(timestamp).toISOString()}>{formatDateTime(timestamp)}</time> &nbsp;{'  '}
          {formattedDuration}
        </>
      }
      value={getValuePerDataSource(beacon, dataSource)}
      inverted
      accentuated
    />
  );
}

function getValuePerDataSource(beacon, dataSource) {
  return {
    sessionStart: beacon.sessionId,
    viewChange: beacon.view,
    httpRequest: `${beacon.httpCallMethod} ${beacon.httpCallUrl}`,
    custom: beacon.customEventName
  }[dataSource];
}
