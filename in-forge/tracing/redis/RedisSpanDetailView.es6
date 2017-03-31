import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function RedisSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Driver">
          {span.getIn(['data', 'redis', 'driver'])}
        </DescriptionItem>
        <DescriptionItem title="Connection">
          {span.getIn(['data', 'redis', 'connection'])}
        </DescriptionItem>
        <DescriptionItem title="Command">
          {span.getIn(['data', 'redis', 'command'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
