import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function GCSSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Region">
          {span.getIn(['data', 'gcs', 'region'])}
        </DescriptionItem>
        <DescriptionItem title="Key">
          {span.getIn(['data', 'gcs', 'key'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
