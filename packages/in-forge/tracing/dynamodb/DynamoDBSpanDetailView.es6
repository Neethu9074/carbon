import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function DynamoDBSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Item">{span.getIn(['data', 'dynamodb', 'item'])}</DescriptionItem>
        <ErrorDescriptionItem error={span.getIn(['data', 'dynamodb', 'error'])} />
      </DescriptionList>
    </div>
  );
}
