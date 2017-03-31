import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function RabbitMqSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Sort">
          {span.getIn(['data', 'rabbitmq', 'sort'])}
        </DescriptionItem>
        <DescriptionItem title="Exchange">
          {span.getIn(['data', 'rabbitmq', 'exchange'])}
        </DescriptionItem>
        <DescriptionItem title="Key">
          {span.getIn(['data', 'rabbitmq', 'key'])}
        </DescriptionItem>
        <DescriptionItem title="Size">
          {span.getIn(['data', 'rabbitmq', 'size'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
