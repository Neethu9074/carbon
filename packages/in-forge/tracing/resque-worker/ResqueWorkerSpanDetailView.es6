import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function ResqueWorkerSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Job">{span.getIn(['data', 'resque-worker', 'job'])}</DescriptionItem>
      <DescriptionItem title="Queue">{span.getIn(['data', 'resque-worker', 'queue'])}</DescriptionItem>
      <ErrorDescriptionItem error={span.getIn(['data', 'resque-worker', 'error'])} />
    </DescriptionList>
  );
}
