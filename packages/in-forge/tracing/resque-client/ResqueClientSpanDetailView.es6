import React from 'react';

import { DescriptionList, DescriptionItem, ErrorDescriptionItem } from 'in-components/DescriptionList';

export default function ResqueClientSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Job">{span.getIn(['data', 'resque-client', 'job'])}</DescriptionItem>
      <DescriptionItem title="Queue">{span.getIn(['data', 'resque-client', 'queue'])}</DescriptionItem>
      <ErrorDescriptionItem error={span.getIn(['data', 'resque-client', 'error'])} />
    </DescriptionList>
  );
}
