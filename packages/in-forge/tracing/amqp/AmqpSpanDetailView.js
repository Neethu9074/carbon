/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function AmqpSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Command">{span.getIn(['data', 'amqp', 'command'])}</Di>
        <Di title="Connection">{span.getIn(['data', 'amqp', 'connection'])}</Di>
        <Di title="Routing Key">{span.getIn(['data', 'amqp', 'routingkey'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'amqp', 'error'])} />
      </Dl>
    </div>
  );
}
