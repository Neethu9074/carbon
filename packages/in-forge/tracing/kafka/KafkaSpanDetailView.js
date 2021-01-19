/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function KafkaSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Access Type">{span.getIn(['data', 'kafka', 'access'])}</Di>
        <Di title="Topic">{span.getIn(['data', 'kafka', 'service'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'kafka', 'error'])} />
      </Dl>
    </div>
  );
}
