/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function EhcacheSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Elements">{span.getIn(['data', 'elements'])}</Di>
        <Di title="Hits">{span.getIn(['data', 'hits'])}</Di>
      </Dl>
    </div>
  );
}
