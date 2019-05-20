import React from 'react';

import CustomDataDescriptionItem from 'in-forge/tracing/sdk/CustomDataDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function MessagingSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Destination">{span.getIn(['data', 'messaging', 'destination'])}</DescriptionItem>
        <CustomDataDescriptionItem span={span} />
      </DescriptionList>
    </div>
  );
}
