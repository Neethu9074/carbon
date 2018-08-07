import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function MuleServerSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Protocol">{span.getIn(['data', 'mule', 'protocol'])}</DescriptionItem>
        <DescriptionItem title="Address">{span.getIn(['data', 'mule', 'address'])}</DescriptionItem>
        <DescriptionItem title="Flow">{span.getIn(['data', 'mule', 'flow'])}</DescriptionItem>
        <DescriptionItem title="Pattern">{span.getIn(['data', 'mule', 'pattern'])}</DescriptionItem>
        <ErrorDescriptionItem error={span.getIn(['data', 'mule', 'error'])} />
      </DescriptionList>
    </div>
  );
}
