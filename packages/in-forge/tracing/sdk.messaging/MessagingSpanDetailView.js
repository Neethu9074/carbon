import React from 'react';

import CustomDataDescriptionItem from 'in-forge/tracing/sdk/CustomDataDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function MessagingSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Destination">{span.getIn(['data', 'messaging', 'destination'])}</Di>
        <CustomDataDescriptionItem span={span} />
      </Dl>
    </div>
  );
}
