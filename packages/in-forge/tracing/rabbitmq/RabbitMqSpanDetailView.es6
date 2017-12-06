import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { isBlank } from 'in-services/util/string';

export default function RabbitMqSpanDetailView({ span }) {
  const exchange = span.getIn(['data', 'rabbitmq', 'exchange']);
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Sort">{span.getIn(['data', 'rabbitmq', 'sort'])}</DescriptionItem>
        <DescriptionItem title="Exchange">{isBlank(exchange) ? '<default exchange>' : exchange}</DescriptionItem>
        <DescriptionItem title="Key">{span.getIn(['data', 'rabbitmq', 'key'])}</DescriptionItem>
        <DescriptionItem title="Size">{span.getIn(['data', 'rabbitmq', 'size'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
