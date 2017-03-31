import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function LogSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Message">
          {span.getIn(['data', 'log', 'message'])}
        </DescriptionItem>
        <DescriptionItem title="Parameters">
          {span.getIn(['data', 'log', 'parameters'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
