import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function DistributeMeClientSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Service">{span.getIn(['data', 'distributeme', 'service'])}</DescriptionItem>
        <DescriptionItem title="Method">{span.getIn(['data', 'distributeme', 'method'])}</DescriptionItem>
        <ErrorDescriptionItem error={span.getIn(['data', 'distributeme', 'error'])} />
      </DescriptionList>
    </div>
  );
}
