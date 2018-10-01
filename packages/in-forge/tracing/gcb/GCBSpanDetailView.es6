import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function GCBSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Operation">{span.getIn(['data', 'gcb', 'op'])}</DescriptionItem>
        <DescriptionItem title="Table">{span.getIn(['data', 'gcb', 'table'])}</DescriptionItem>
        <DescriptionItem title="Key">{span.getIn(['data', 'gcb', 'key'])}</DescriptionItem>
        <ErrorDescriptionItem error={span.getIn(['data', 'gcb', 'error'])} />
      </DescriptionList>
    </div>
  );
}
