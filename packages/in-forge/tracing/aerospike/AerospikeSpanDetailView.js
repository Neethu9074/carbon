/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function AerospikeSpanDetailView({ span }) {
  const parameters = span.getIn(['data', 'aerospike', 'parameters']);
  const statement = span.getIn(['data', 'aerospike', 'statement']);

  return (
    <div>
      <Dl>
        <Di title="Namespace">{span.getIn(['data', 'aerospike', 'ns'])}</Di>
        <Di title="Set name">{span.getIn(['data', 'aerospike', 'setName'])}</Di>
        <Di title="User key">{span.getIn(['data', 'aerospike', 'userKey'])}</Di>
        <Di title="Operation">{span.getIn(['data', 'aerospike', 'op'])}</Di>
        <Di title="Host">{span.getIn(['data', 'aerospike', 'host'])}</Di>
        <Di title="Port">{span.getIn(['data', 'aerospike', 'port'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'aerospike', 'error'])} />

        {parameters ? <Di title="Parameters">{parameters}</Di> : null}

        {statement ? <Di title="Statement">{statement}</Di> : null}
      </Dl>
    </div>
  );
}
