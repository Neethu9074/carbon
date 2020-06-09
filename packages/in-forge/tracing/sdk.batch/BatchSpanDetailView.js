import React from 'react';

import CustomDataDescriptionItem from 'in-forge/tracing/sdk/CustomDataDescriptionItem';
import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function BatchSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Job">{span.getIn(['data', 'batch', 'job'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'sdk', 'custom', 'tags', 'message'])} />
        <CustomDataDescriptionItem span={span} />
      </Dl>
    </div>
  );
}
