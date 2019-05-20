import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function S3SpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Region">{span.getIn(['data', 's3', 'region'])}</DescriptionItem>
        <DescriptionItem title="Bucket">{span.getIn(['data', 's3', 'bucket'])}</DescriptionItem>
        <DescriptionItem title="Operation">{span.getIn(['data', 's3', 'op'])}</DescriptionItem>
        <DescriptionItem title="Key">{span.getIn(['data', 's3', 'key'])}</DescriptionItem>
        <ErrorDescriptionItem error={span.getIn(['data', 's3', 'error'])} />
      </DescriptionList>
    </div>
  );
}
