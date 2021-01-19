/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function ResqueClientSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Job">{span.getIn(['data', 'resque-client', 'job'])}</Di>
      <Di title="Queue">{span.getIn(['data', 'resque-client', 'queue'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'resque-client', 'error'])} />
    </Dl>
  );
}
