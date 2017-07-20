import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function SidekiqWorkerSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Job">
        {span.getIn(['data', 'sidekiq-worker', 'job'])}
      </DescriptionItem>
      <DescriptionItem title="Queue">
        {span.getIn(['data', 'sidekiq-worker', 'queue'])}
      </DescriptionItem>
      <DescriptionItem title="Retry">
        {span.getIn(['data', 'sidekiq-worker', 'retry'])}
      </DescriptionItem>
      <DescriptionItem title="Job ID">
        {span.getIn(['data', 'sidekiq-worker', 'job_id'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
