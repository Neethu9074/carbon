import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function S3SpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Key">
          {span.getIn(['data', 's3', 'key'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
