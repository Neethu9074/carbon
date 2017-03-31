import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function ActionControllerSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Controller">
        {span.getIn(['data', 'actioncontroller', 'controller'])}
      </DescriptionItem>
      <DescriptionItem title="Action">
        {span.getIn(['data', 'actioncontroller', 'action'])}
      </DescriptionItem>
      <DescriptionItem title="Error Message">
        {span.getIn(['data', 'log', 'message'])}
      </DescriptionItem>
      <DescriptionItem title="Error Type">
        {span.getIn(['data', 'log', 'parameters'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
