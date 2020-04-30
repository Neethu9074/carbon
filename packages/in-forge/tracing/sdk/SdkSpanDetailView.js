import React from 'react';

import CustomDataDescriptionItem from 'in-forge/tracing/sdk/CustomDataDescriptionItem';
import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function SdkSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Captured Arguments">{span.getIn(['data', 'sdk', 'arguments'])}</Di>
        <Di title="Captured Return Value">{span.getIn(['data', 'sdk', 'return'])}</Di>
        <Di title="Exception">{span.getIn(['data', 'sdk', 'exception'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'sdk', 'custom', 'tags', 'message'])} />
        <CustomDataDescriptionItem span={span} />
      </Dl>
    </div>
  );
}
