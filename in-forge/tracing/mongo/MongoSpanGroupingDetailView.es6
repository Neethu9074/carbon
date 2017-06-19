import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function MongoSpanGroupingDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Namespace">
          {span.getIn(['data', 'mongo', 'namespace'])}
        </DescriptionItem>
        <DescriptionItem title="Command">
          {span.getIn(['data', 'mongo', 'command'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
