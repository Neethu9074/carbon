/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function MongoSpanGroupingDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Namespace">{span.getIn(['data', 'mongo', 'namespace'])}</Di>
        <Di title="Command">{span.getIn(['data', 'mongo', 'command'])}</Di>
      </Dl>
    </div>
  );
}
