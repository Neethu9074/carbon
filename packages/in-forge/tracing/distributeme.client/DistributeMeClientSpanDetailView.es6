import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function DistributeMeClientSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Service">{span.getIn(['data', 'distributeme', 'service'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
