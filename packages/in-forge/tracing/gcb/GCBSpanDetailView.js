/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function GCBSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Operation">{span.getIn(['data', 'gcb', 'op'])}</Di>
        <Di title="Table">{span.getIn(['data', 'gcb', 'table'])}</Di>
        <Di title="Key">{span.getIn(['data', 'gcb', 'key'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'gcb', 'error'])} />
      </Dl>
    </div>
  );
}
