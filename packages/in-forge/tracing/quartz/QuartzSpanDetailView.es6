import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function QuartzSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Group">{span.getIn(['data', 'quartz', 'group'])}</DescriptionItem>
      <DescriptionItem title="Name">{span.getIn(['data', 'quartz', 'name'])}</DescriptionItem>
      <DescriptionItem title="Type">{span.getIn(['data', 'quartz', 'type'])}</DescriptionItem>
    </DescriptionList>
  );
}
