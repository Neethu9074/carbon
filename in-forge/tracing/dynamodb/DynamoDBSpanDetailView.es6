import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function DynamoDBSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Item">{span.getIn(['data', 'dynamodb', 'item'])}</DescriptionItem>
        <DescriptionItem title="Error">{span.getIn(['data', 'dynamodb', 'error'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}