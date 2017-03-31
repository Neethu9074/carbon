import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function MuleClientSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Protocol">
          {span.getIn(['data', 'mule', 'protocol'])}
        </DescriptionItem>
        <DescriptionItem title="Address">
          {span.getIn(['data', 'mule', 'address'])}
        </DescriptionItem>
        <DescriptionItem title="ID">
          {span.getIn(['data', 'mule', 'id'])}
        </DescriptionItem>
        <DescriptionItem title="Pattern">
          {span.getIn(['data', 'mule', 'pattern'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
