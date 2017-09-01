import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function VertxClusterSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Sort">
          {span.getIn(['data', 'vertx', 'cluster', 'sort'])}
        </DescriptionItem>
        <DescriptionItem title="Address">
          {span.getIn(['data', 'vertx', 'cluster', 'address'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
