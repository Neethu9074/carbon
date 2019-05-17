import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function SqsSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Queue">{span.getIn(['data', 'sqs', 'queue'])}</DescriptionItem>
        <DescriptionItem title="Batch Size">{span.getIn(['data', 'sqs', 'size'])}</DescriptionItem>
        <DescriptionItem title="Type">{span.getIn(['data', 'sqs', 'type'])}</DescriptionItem>
        <DescriptionItem title="Response Code">{span.getIn(['data', 'sqs', 'responseCode'])}</DescriptionItem>
        <ErrorDescriptionItem error={span.getIn(['data', 'sqs', 'error'])} />
      </DescriptionList>
    </div>
  );
}
