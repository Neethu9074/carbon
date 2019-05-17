import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function KafkaSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Access Type">{span.getIn(['data', 'kafka', 'access'])}</DescriptionItem>
        <DescriptionItem title="Topic">{span.getIn(['data', 'kafka', 'service'])}</DescriptionItem>
        <ErrorDescriptionItem error={span.getIn(['data', 'kafka', 'error'])} />
      </DescriptionList>
    </div>
  );
}
