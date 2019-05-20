import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function ResqueClientSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Job">{span.getIn(['data', 'resque-client', 'job'])}</DescriptionItem>
      <DescriptionItem title="Queue">{span.getIn(['data', 'resque-client', 'queue'])}</DescriptionItem>
      <ErrorDescriptionItem error={span.getIn(['data', 'resque-client', 'error'])} />
    </DescriptionList>
  );
}
