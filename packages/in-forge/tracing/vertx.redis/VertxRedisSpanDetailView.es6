import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function VertxRedisSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Connection">{span.getIn(['data', 'vertx', 'redis', 'conn'])}</DescriptionItem>
        <DescriptionItem title="Command">{span.getIn(['data', 'vertx', 'redis', 'cmd'])}</DescriptionItem>
        <DescriptionItem title="Channel">{span.getIn(['data', 'vertx', 'redis', 'channel'])}</DescriptionItem>
        <DescriptionItem title="Key">{span.getIn(['data', 'vertx', 'redis', 'key'])}</DescriptionItem>
        <ErrorDescriptionItem error={span.getIn(['data', 'vertx', 'redis', 'error'])} />
      </DescriptionList>
    </div>
  );
}
