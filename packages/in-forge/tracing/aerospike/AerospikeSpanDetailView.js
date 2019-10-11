import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function AerospikeSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Operation">{span.getIn(['data', 'aerospike', 'op'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'aerospike', 'error'])} />
      </Dl>
    </div>
  );
}
