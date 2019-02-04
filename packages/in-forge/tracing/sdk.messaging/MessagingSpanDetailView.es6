import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function MessagingSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Destination">{span.getIn(['data', 'messaging', 'destination'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
