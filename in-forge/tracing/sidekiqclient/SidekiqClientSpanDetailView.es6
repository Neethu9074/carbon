import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function SidekiqClientSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Job">
        {span.getIn(['data', 'sidekiqclient', 'job'])}
      </DescriptionItem>
      <DescriptionItem title="Queue">
        {span.getIn(['data', 'sidekiqclient', 'queue'])}
      </DescriptionItem>
      <DescriptionItem title="Retry">
        {span.getIn(['data', 'sidekiqclient', 'retry'])}
      </DescriptionItem>
      <DescriptionItem title="Job ID">
        {span.getIn(['data', 'sidekiqclient', 'jobid'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
