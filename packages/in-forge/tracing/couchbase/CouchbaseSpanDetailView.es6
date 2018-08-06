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
      </DescriptionList>
    </div>
  );
}
