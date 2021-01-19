/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function DistributeMeClientSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Service">{span.getIn(['data', 'distributeme', 'service'])}</Di>
        <Di title="Method">{span.getIn(['data', 'distributeme', 'method'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'distributeme', 'error'])} />
      </Dl>
    </div>
  );
}
