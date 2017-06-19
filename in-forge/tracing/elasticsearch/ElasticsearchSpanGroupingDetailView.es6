import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function ElasticsearchSpanGroupingDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Action">
        {span.getIn(['data', 'elasticsearch', 'action'])}
      </DescriptionItem>
      <DescriptionItem title="Index">
        {span.getIn(['data', 'elasticsearch', 'index'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
