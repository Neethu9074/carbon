import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';

export default function RedisSpanDetailView({ span }) {
  const subCommands = span.getIn(['data', 'redis', 'subCommands'], emptyList);
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Connection">{span.getIn(['data', 'redis', 'connection'])}</DescriptionItem>
        <DescriptionItem title="Driver">{span.getIn(['data', 'redis', 'driver'])}</DescriptionItem>
        <DescriptionItem title="Command">{span.getIn(['data', 'redis', 'command'])}</DescriptionItem>
        {subCommands.size > 0 ? (
          <DescriptionItem title="Commands in Transaction">{subCommands.join(', ')}</DescriptionItem>
        ) : null}
        <DescriptionItem title="Error">{span.getIn(['data', 'redis', 'error'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
