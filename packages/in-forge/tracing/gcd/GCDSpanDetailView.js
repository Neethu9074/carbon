/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function GCDSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Operation">{span.getIn(['data', 'gcd', 'op'])}</Di>
        <Di title="Operation mode">{span.getIn(['data', 'gcd', 'mode'])}</Di>
        <Di title="Namespace">{span.getIn(['data', 'gcd', 'namespace'])}</Di>
        <Di title="Entity Identifier">{span.getIn(['data', 'gcd', 'entity', 'identifier'])}</Di>
        <Di title="Entity properties">{span.getIn(['data', 'gcs', 'entity', 'properties'])}</Di>
      </Dl>
    </div>
  );
}
