import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function CouchbaseSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Hostname">{span.getIn(['data', 'couchbase', 'hostname'])}</Di>
        <Di title="Bucket">{span.getIn(['data', 'couchbase', 'bucket'])}</Di>
        <Di title="Type">{span.getIn(['data', 'couchbase', 'type'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'couchbase', 'error'])} />
        <Di title="Error Code">{span.getIn(['data', 'couchbase', 'error_code'])}</Di>
      </Dl>
    </div>
  );
}
