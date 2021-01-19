/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function MemcacheSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Operation">{span.getIn(['data', 'memcached', 'operation'])}</Di>
        <Di title="Key">{span.getIn(['data', 'memcached', 'key'])}</Di>
        <Di title="Result Code">{span.getIn(['data', 'memcached', 'resultCode'])}</Di>
        <Di title="Result Message">{span.getIn(['data', 'memcached', 'resultMessage'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'memcached', 'error'])} />
      </Dl>
    </div>
  );
}
