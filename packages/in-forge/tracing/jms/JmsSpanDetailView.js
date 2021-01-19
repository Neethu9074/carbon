/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function JmsSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Destination">{span.getIn(['data', 'jms', 'destination'])}</Di>
        <Di title="Message">{span.getIn(['data', 'jms', 'message'])}</Di>
        <Di title="Type">{span.getIn(['data', 'jms', 'type'])}</Di>
        <Di title="Selector">{span.getIn(['data', 'jms', 'selector'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'jms', 'error'])} />
      </Dl>
    </div>
  );
}
