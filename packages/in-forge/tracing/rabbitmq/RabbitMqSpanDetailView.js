/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { isBlank } from 'in-services/util/string';

export default function RabbitMqSpanDetailView({ span }) {
  const exchange = span.getIn(['data', 'rabbitmq', 'exchange']);
  return (
    <div>
      <Dl>
        <Di title="Sort">{span.getIn(['data', 'rabbitmq', 'sort'])}</Di>
        <Di title="Exchange">{isBlank(exchange) ? '<default exchange>' : exchange}</Di>
        <Di title="Key">{span.getIn(['data', 'rabbitmq', 'key'])}</Di>
        <Di title="Size">{span.getIn(['data', 'rabbitmq', 'size'])}</Di>
      </Dl>
    </div>
  );
}
