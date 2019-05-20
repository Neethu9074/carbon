import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function OncRpcSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Host">{span.getIn(['data', 'oncrpc', 'host'])}</DescriptionItem>
      <DescriptionItem title="Port">{span.getIn(['data', 'oncrpc', 'port'])}</DescriptionItem>
      <DescriptionItem title="Program">{span.getIn(['data', 'oncrpc', 'program'])}</DescriptionItem>
      <DescriptionItem title="Procedure">{span.getIn(['data', 'oncrpc', 'procedure'])}</DescriptionItem>
      <DescriptionItem title="Version">{span.getIn(['data', 'oncrpc', 'version'])}</DescriptionItem>
      <ErrorDescriptionItem error={span.getIn(['data', 'oncrpc', 'error'])} />
    </DescriptionList>
  );
}
