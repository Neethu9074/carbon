import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function SidekiqClientSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Job">
        {span.getIn(['data', 'sidekiq-client', 'job'])}
      </DescriptionItem>
      <DescriptionItem title="Queue">
        {span.getIn(['data', 'sidekiq-client', 'queue'])}
      </DescriptionItem>
      <DescriptionItem title="Retry">
        {span.getIn(['data', 'sidekiq-client', 'retry'])}
      </DescriptionItem>
      <DescriptionItem title="Job ID">
        {span.getIn(['data', 'sidekiq-client', 'job_id'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
