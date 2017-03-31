import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function HornetQSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Address">
          {span.getIn(['data', 'hornetq', 'address'])}
        </DescriptionItem>
        <DescriptionItem title="Message ID">
          {span.getIn(['data', 'hornetq', 'messageId'])}
        </DescriptionItem>
        <DescriptionItem title="User ID">
          {span.getIn(['data', 'hornetq', 'userId'])}
        </DescriptionItem>
        <DescriptionItem title="Size">
          {span.getIn(['data', 'hornetq', 'size'])}
        </DescriptionItem>
        <DescriptionItem title="Large">
          {span.getIn(['data', 'hornetq', 'large'])}
        </DescriptionItem>
        <DescriptionItem title="Durable">
          {span.getIn(['data', 'hornetq', 'durable'])}
        </DescriptionItem>
        <DescriptionItem title="Blocking">
          {span.getIn(['data', 'hornetq', 'blocking'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
