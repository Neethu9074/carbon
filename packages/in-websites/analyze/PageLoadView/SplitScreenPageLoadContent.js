/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { formatDateTime } from 'in-services/formatters/date';
import { latencyFixed } from 'in-services/formatters/number';
import KeyValue from 'in-new-components/lists/KeyValue';

export default function SplitScreenPageLoadContent(props) {
  const { beacon, dataSource } = props;
  const { timestamp, duration } = beacon;
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
      value={getValuePerDataSource(beacon, dataSource)}
      inverted
      accentuated
    />
  );
}

function getValuePerDataSource(beacon, dataSource) {
  return {
    pageLoad: getLocationOriginPath(beacon),
    pageChange: getLocationOriginPath(beacon),
    resourceLoad: beacon.httpCallUrl,
    httpRequest: `${beacon.httpCallMethod} ${beacon.httpCallUrl}`,
    error: beacon.errorMessage,
    custom: beacon.customEventName
  }[dataSource];
}

function getLocationOriginPath(beacon) {
  if (beacon.locationPath.length > 1) {
    return beacon.locationPath;
  }
  return beacon.locationOrigin + beacon.locationPath;
}
