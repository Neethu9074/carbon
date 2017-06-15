import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function EhcacheSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Elements">
          {span.getIn(['data', 'elements'])}
        </DescriptionItem>
        <DescriptionItem title="Hits">
          {span.getIn(['data', 'hits'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
