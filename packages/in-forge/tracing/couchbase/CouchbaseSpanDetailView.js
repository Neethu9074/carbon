import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function CouchbaseSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Hostname">{span.getIn(['data', 'couchbase', 'hostname'])}</DescriptionItem>
        <DescriptionItem title="Bucket">{span.getIn(['data', 'couchbase', 'bucket'])}</DescriptionItem>
        <DescriptionItem title="Type">{span.getIn(['data', 'couchbase', 'type'])}</DescriptionItem>
        <ErrorDescriptionItem error={span.getIn(['data', 'couchbase', 'error'])} />
        <DescriptionItem title="Error Code">{span.getIn(['data', 'couchbase', 'error_code'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
