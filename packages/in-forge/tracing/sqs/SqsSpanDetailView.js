/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function SqsSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Queue">{span.getIn(['data', 'sqs', 'queue'])}</Di>
        <Di title="Batch Size">{span.getIn(['data', 'sqs', 'size'])}</Di>
        <Di title="Type">{span.getIn(['data', 'sqs', 'type'])}</Di>
        <Di title="Response Code">{span.getIn(['data', 'sqs', 'responseCode'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'sqs', 'error'])} />
      </Dl>
    </div>
  );
}
