import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function ActionViewSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Error Message">
        {span.getIn(['data', 'log', 'message'])}
      </DescriptionItem>
      <DescriptionItem title="Error Type">
        {span.getIn(['data', 'log', 'parameters'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
