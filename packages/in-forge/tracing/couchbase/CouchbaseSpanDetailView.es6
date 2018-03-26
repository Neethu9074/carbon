import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function CouchbaseSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Hostname">{span.getIn(['data', 'couchbase', 'hostname'])}</DescriptionItem>
        <DescriptionItem title="Bucket">{span.getIn(['data', 'couchbase', 'bucket'])}</DescriptionItem>
        <DescriptionItem title="Type">{span.getIn(['data', 'couchbase', 'type'])}</DescriptionItem>
        <DescriptionItem title="Error">{span.getIn(['data', 'couchbase', 'error'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
