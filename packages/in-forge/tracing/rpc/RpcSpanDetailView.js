/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function RpcSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Flavor">{span.getIn(['data', 'rpc', 'flavor'])}</Di>
      <Di title="Host">{span.getIn(['data', 'rpc', 'host'])}</Di>
      <Di title="Remote Port">{span.getIn(['data', 'rpc', 'port'])}</Di>
      <Di title="Procedure/Method">{span.getIn(['data', 'rpc', 'call'])}</Di>
      <Di title="Call Type">{span.getIn(['data', 'rpc', 'call_type'])}</Di>
      <Di title="Parameters">{span.getIn(['data', 'rpc', 'params'])}</Di>
      <Di title="Baggage">{span.getIn(['data', 'rpc', 'baggage'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'rpc', 'error'])} />
    </Dl>
  );
}
