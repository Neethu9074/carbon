/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function ResqueWorkerSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Job">{span.getIn(['data', 'resque-worker', 'job'])}</Di>
      <Di title="Queue">{span.getIn(['data', 'resque-worker', 'queue'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'resque-worker', 'error'])} />
    </Dl>
  );
}
