import React from 'react';

import { DescriptionList, DescriptionItem, ErrorDescriptionItem } from 'in-components/DescriptionList';

export default function ResqueWorkerSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Job">{span.getIn(['data', 'resque-worker', 'job'])}</DescriptionItem>
      <DescriptionItem title="Queue">{span.getIn(['data', 'resque-worker', 'queue'])}</DescriptionItem>
      <ErrorDescriptionItem error={span.getIn(['data', 'resque-worker', 'error'])} />
    </DescriptionList>
  );
}
