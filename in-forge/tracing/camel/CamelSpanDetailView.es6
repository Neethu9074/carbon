import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function CamelSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Type">
          {span.getIn(['data', 'camel', 'type'])}
        </DescriptionItem>
        <DescriptionItem title="Quartz">
          {span.getIn(['data', 'camel', 'quartz'])}
        </DescriptionItem>
        <DescriptionItem title="Timer">
          {span.getIn(['data', 'camel', 'timer'])}
        </DescriptionItem>
        <DescriptionItem title="Sort">
          {span.getIn(['data', 'camel', 'sort'])}
        </DescriptionItem>
        <DescriptionItem title="Size">
          {span.getIn(['data', 'camel', 'size'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
