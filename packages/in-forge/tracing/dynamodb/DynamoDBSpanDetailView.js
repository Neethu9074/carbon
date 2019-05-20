import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function DynamoDBSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Table">{span.getIn(['data', 'dynamodb', 'table'])}</DescriptionItem>
        <DescriptionItem title="Operation">{span.getIn(['data', 'dynamodb', 'op'])}</DescriptionItem>
        <ErrorDescriptionItem error={span.getIn(['data', 'dynamodb', 'error'])} />
      </DescriptionList>
    </div>
  );
}
