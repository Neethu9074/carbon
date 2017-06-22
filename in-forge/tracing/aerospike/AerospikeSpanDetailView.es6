import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function AerospikeSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Operation">
          {span.getIn(['data', 'aerospike', 'op'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
