import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function HzSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Operation">{span.getIn(['data', 'hz', 'op'])}</DescriptionItem>
        <DescriptionItem title="Connection">{span.getIn(['data', 'hz', 'conn'])}</DescriptionItem>
        <DescriptionItem title="Name">{span.getIn(['data', 'hz', 'name'])}</DescriptionItem>
        <ErrorDescriptionItem error={span.getIn(['data', 'hz', 'error'])} />
      </DescriptionList>
    </div>
  );
}
