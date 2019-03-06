import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import CustomDataDescriptionItem from 'in-forge/tracing/sdk/CustomDataDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function RpcSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Flavor">{span.getIn(['data', 'rpc', 'flavor'])}</DescriptionItem>
      <DescriptionItem title="Host">{span.getIn(['data', 'rpc', 'host'])}</DescriptionItem>
      <DescriptionItem title="Remote Port">{span.getIn(['data', 'rpc', 'port'])}</DescriptionItem>
      <DescriptionItem title="Procedure/Method">{span.getIn(['data', 'rpc', 'call'])}</DescriptionItem>
      <DescriptionItem title="Call Type">{span.getIn(['data', 'rpc', 'call_type'])}</DescriptionItem>
      <DescriptionItem title="Parameters">{span.getIn(['data', 'rpc', 'params'])}</DescriptionItem>
      <DescriptionItem title="Baggage">{span.getIn(['data', 'rpc', 'baggage'])}</DescriptionItem>
      <ErrorDescriptionItem error={span.getIn(['data', 'rpc', 'error'])} />
      <CustomDataDescriptionItem span={span} />
    </DescriptionList>
  );
}
