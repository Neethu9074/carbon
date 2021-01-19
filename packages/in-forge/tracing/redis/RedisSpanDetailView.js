/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { emptyList } from 'in-services/fixedImmutables';

export default function RedisSpanDetailView({ span }) {
  const subCommands = span.getIn(['data', 'redis', 'subCommands'], emptyList);
  return (
    <div>
      <Dl>
        <Di title="Connection">{span.getIn(['data', 'redis', 'connection'])}</Di>
        <Di title="Driver">{span.getIn(['data', 'redis', 'driver'])}</Di>
        <Di title="Command">{span.getIn(['data', 'redis', 'command'])}</Di>
        {subCommands.size > 0 ? <Di title="Commands in Transaction">{subCommands.join(', ')}</Di> : null}
        <Di title="Key">{span.getIn(['data', 'redis', 'key'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'redis', 'error'])} />
      </Dl>
    </div>
  );
}
