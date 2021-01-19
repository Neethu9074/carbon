/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function VertxClusterSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Sort">{span.getIn(['data', 'vertx', 'cluster', 'sort'])}</Di>
        <Di title="Address">{span.getIn(['data', 'vertx', 'cluster', 'address'])}</Di>
      </Dl>
    </div>
  );
}
