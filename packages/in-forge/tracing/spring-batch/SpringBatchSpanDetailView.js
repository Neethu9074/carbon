/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function SpringBatchSpanDetailView({ span }) {
  const error = span.getIn(['data', 'batch', 'error']);

  return (
    <div>
      <Dl>
        <Di title="Job">{span.getIn(['data', 'batch', 'job'])}</Di>
        <Di title="Parameters">{span.getIn(['data', 'batch', 'parameters'])}</Di>
        <Di title="Exit Status">{span.getIn(['data', 'batch', 'status'])}</Di>
        {error ? (
          <Di title="Error" verticalDisplay>
            <ErrorDescriptionItem error={error} />
          </Di>
        ) : null}
      </Dl>
    </div>
  );
}
