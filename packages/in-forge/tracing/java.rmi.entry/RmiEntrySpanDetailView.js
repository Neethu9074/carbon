import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function RmiEntrySpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Method">{span.getIn(['data', 'rmi', 'method'])}</DescriptionItem>
      <ErrorDescriptionItem error={span.getIn(['data', 'rmi', 'error'])} />
    </DescriptionList>
  );
}
