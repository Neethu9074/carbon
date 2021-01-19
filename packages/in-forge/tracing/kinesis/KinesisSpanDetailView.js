/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function KinesisSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Stream">{span.getIn(['data', 'kinesis', 'stream'])}</Di>
        <Di title="Operation">{span.getIn(['data', 'kinesis', 'op'])}</Di>
        <Di title="Record">{span.getIn(['data', 'kinesis', 'record'])}</Di>
        <Di title="Shard">{span.getIn(['data', 'kinesis', 'shard'])}</Di>
        <Di title="Shard Type">{span.getIn(['data', 'kinesis', 'shardType'])}</Di>
        <Di title="Start Sequence Number">{span.getIn(['data', 'kinesis', 'startSequenceNumber'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'kinesis', 'error'])} />
      </Dl>
    </div>
  );
}
