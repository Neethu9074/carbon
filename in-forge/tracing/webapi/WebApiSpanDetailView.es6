import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function WebApiSpanDetailView({ span }) {
  const controller = span.getIn(['data', 'webapi', 'controller']);
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Controller">
          {controller ? controller : 'unknown'}
        </DescriptionItem>
        <DescriptionItem title="Action">
          {span.getIn(['data', 'webapi', 'action'])}
        </DescriptionItem>
        <DescriptionItem title="Url">
          {span.getIn(['data', 'webapi', 'url'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
