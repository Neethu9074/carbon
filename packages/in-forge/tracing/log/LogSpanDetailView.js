import React from 'react';

import CustomDataDescriptionItem from 'in-forge/tracing/sdk/CustomDataDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function LogSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Level">{span.getIn(['data', 'log', 'level'])}</DescriptionItem>
      <DescriptionItem title="Logger">{span.getIn(['data', 'log', 'logger'])}</DescriptionItem>
      <DescriptionItem title="Message">{span.getIn(['data', 'log', 'message'])}</DescriptionItem>
      <DescriptionItem title="Parameters">{span.getIn(['data', 'log', 'parameters'])}</DescriptionItem>
      <DescriptionItem title="Thread">{span.getIn(['data', 'log', 'thread'])}</DescriptionItem>

      <CustomDataDescriptionItem span={span} />
    </DescriptionList>
  );
}
