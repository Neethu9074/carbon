/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { yesOrNo } from 'in-services/formatters/boolean';

export default function MemcacheSpanDetailView({ span }) {
  const command = span.getIn(['data', 'memcache', 'command']);

  return (
    <div>
      <Dl>
        <Di title="Command">{command}</Di>
        <Di title="Key">{span.getIn(['data', 'memcache', 'key'])}</Di>

        {command === 'get' ? <Di title="Hit">{yesOrNo(span.getIn(['data', 'memcache', 'hit']) == 1)}</Di> : null}

        <Di title="Keys">{span.getIn(['data', 'memcache', 'keys'])}</Di>
        <Di title="Hit Count">{span.getIn(['data', 'memcache', 'hits'])}</Di>
        <Di title="Namespace">{span.getIn(['data', 'memcache', 'namespace'])}</Di>
        <Di title="Server">{span.getIn(['data', 'memcache', 'server'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'memcache', 'error'])} />
      </Dl>
    </div>
  );
}
