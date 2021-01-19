/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function JBossSchedulerSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Job">{span.getIn(['data', 'jboss', 'name'])}</Di>
        <Di title="Parameters">{span.getIn(['data', 'jboss', 'parameters'])}</Di>
        <Di title="Error">{span.getIn(['data', 'jboss', 'error'])}</Di>
      </Dl>
    </div>
  );
}
