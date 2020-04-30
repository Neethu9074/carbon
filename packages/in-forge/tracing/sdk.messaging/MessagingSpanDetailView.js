import React from 'react';

import CustomDataDescriptionItem from 'in-forge/tracing/sdk/CustomDataDescriptionItem';
import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function MessagingSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Destination">{span.getIn(['data', 'messaging', 'destination'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'sdk', 'custom', 'tags', 'message'])} />
        <CustomDataDescriptionItem span={span} />
      </Dl>
    </div>
  );
}
