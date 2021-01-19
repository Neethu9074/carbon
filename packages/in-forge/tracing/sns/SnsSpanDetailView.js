/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function SnsSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Topic">{span.getIn(['data', 'sns', 'topic'])}</Di>
        <Di title="Target">{span.getIn(['data', 'sns', 'target'])}</Di>
        <Di title="Phone">{span.getIn(['data', 'sns', 'phone'])}</Di>
        <Di title="Subject">{span.getIn(['data', 'sns', 'subject'])}</Di>
        <Di title="Response Code">{span.getIn(['data', 'sns', 'responseCode'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'sns', 'error'])} />
      </Dl>
    </div>
  );
}
