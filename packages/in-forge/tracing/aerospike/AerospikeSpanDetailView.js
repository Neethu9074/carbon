import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function AerospikeSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Operation">{span.getIn(['data', 'aerospike', 'op'])}</DescriptionItem>
        <ErrorDescriptionItem error={span.getIn(['data', 'aerospike', 'error'])} />
      </DescriptionList>
    </div>
  );
}
