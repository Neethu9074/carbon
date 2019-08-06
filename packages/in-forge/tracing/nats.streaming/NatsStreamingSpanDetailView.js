import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function NatsStreamingSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Sort">{span.getIn(['data', 'nats', 'sort'])}</DescriptionItem>
        <DescriptionItem title="Subject">{span.getIn(['data', 'nats', 'subject'])}</DescriptionItem>
        <ErrorDescriptionItem error={span.getIn(['data', 'nats', 'error'])} />
      </DescriptionList>
    </div>
  );
}
