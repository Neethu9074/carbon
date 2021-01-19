/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function BatchSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Job">{span.getIn(['data', 'batch', 'job'])}</Di>
      </Dl>
    </div>
  );
}
