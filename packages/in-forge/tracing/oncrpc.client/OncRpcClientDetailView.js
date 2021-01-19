/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function OncRpcSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Host">{span.getIn(['data', 'oncrpc', 'host'])}</Di>
      <Di title="Port">{span.getIn(['data', 'oncrpc', 'port'])}</Di>
      <Di title="Program">{span.getIn(['data', 'oncrpc', 'program'])}</Di>
      <Di title="Procedure">{span.getIn(['data', 'oncrpc', 'procedure'])}</Di>
      <Di title="Version">{span.getIn(['data', 'oncrpc', 'version'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'oncrpc', 'error'])} />
    </Dl>
  );
}
