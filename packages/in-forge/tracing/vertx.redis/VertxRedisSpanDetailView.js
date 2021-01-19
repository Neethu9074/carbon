/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function VertxRedisSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Connection">{span.getIn(['data', 'vertx', 'redis', 'conn'])}</Di>
        <Di title="Command">{span.getIn(['data', 'vertx', 'redis', 'cmd'])}</Di>
        <Di title="Channel">{span.getIn(['data', 'vertx', 'redis', 'channel'])}</Di>
        <Di title="Key">{span.getIn(['data', 'vertx', 'redis', 'key'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'vertx', 'redis', 'error'])} />
      </Dl>
    </div>
  );
}
