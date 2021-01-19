/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function MuleServerSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Protocol">{span.getIn(['data', 'mule', 'protocol'])}</Di>
        <Di title="Address">{span.getIn(['data', 'mule', 'address'])}</Di>
        <Di title="Flow">{span.getIn(['data', 'mule', 'flow'])}</Di>
        <Di title="Pattern">{span.getIn(['data', 'mule', 'pattern'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'mule', 'error'])} />
      </Dl>
    </div>
  );
}
