/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function HzSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Operation">{span.getIn(['data', 'hz', 'op'])}</Di>
        <Di title="Connection">{span.getIn(['data', 'hz', 'conn'])}</Di>
        <Di title="Name">{span.getIn(['data', 'hz', 'name'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'hz', 'error'])} />
      </Dl>
    </div>
  );
}
