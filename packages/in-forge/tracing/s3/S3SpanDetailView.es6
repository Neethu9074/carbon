import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function S3SpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Region">{span.getIn(['data', 's3', 'region'])}</DescriptionItem>
        <DescriptionItem title="Key">{span.getIn(['data', 's3', 'key'])}</DescriptionItem>
        <DescriptionItem title="Operation">{span.getIn(['data', 's3', 'op'])}</DescriptionItem>
        <DescriptionItem title="Error">{span.getIn(['data', 's3', 'error'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
