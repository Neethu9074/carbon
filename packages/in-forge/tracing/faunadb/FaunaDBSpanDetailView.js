/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function FaunaDBSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Query">{span.getIn(['data', 'faunadb', 'query'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'faunadb', 'error'])} />
      </Dl>
    </div>
  );
}
