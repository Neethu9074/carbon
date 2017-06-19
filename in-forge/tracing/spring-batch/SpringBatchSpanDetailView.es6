import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function SpringBatchSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Job">
          {span.getIn(['data', 'batch', 'job'])}
        </DescriptionItem>
        <DescriptionItem title="Parameters">
          {span.getIn(['data', 'batch', 'parameters'])}
        </DescriptionItem>
        <DescriptionItem title="Exit Status">
          {span.getIn(['data', 'batch', 'status'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
