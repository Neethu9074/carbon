import React from 'react';

import CustomDataDescriptionItem from 'in-forge/tracing/sdk/CustomDataDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function SdkSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Captured Arguments">{span.getIn(['data', 'sdk', 'arguments'])}</DescriptionItem>
        <DescriptionItem title="Captured Return Value">{span.getIn(['data', 'sdk', 'return'])}</DescriptionItem>
        <DescriptionItem title="Exception">{span.getIn(['data', 'sdk', 'exception'])}</DescriptionItem>
        <CustomDataDescriptionItem span={span} />
      </DescriptionList>
    </div>
  );
}
