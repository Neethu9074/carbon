import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function HangfireSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Id">{span.getIn(['data', 'hangfire', 'jobid'])}</DescriptionItem>
        <DescriptionItem title="Name">{span.getIn(['data', 'hangfire', 'jobname'])}</DescriptionItem>
        <DescriptionItem title="Type">{span.getIn(['data', 'hangfire', 'jobtype'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
