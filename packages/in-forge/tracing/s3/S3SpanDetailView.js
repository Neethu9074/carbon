import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function S3SpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Region">{span.getIn(['data', 's3', 'region'])}</Di>
        <Di title="Bucket">{span.getIn(['data', 's3', 'bucket'])}</Di>
        <Di title="Operation">{span.getIn(['data', 's3', 'op'])}</Di>
        <Di title="Key">{span.getIn(['data', 's3', 'key'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 's3', 'error'])} />
      </Dl>
    </div>
  );
}
