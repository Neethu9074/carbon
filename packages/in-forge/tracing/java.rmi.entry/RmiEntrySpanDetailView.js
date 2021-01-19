/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function RmiEntrySpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Method">{span.getIn(['data', 'rmi', 'method'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'rmi', 'error'])} />
    </Dl>
  );
}
