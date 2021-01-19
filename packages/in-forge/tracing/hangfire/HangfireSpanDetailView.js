/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function HangfireSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Id">{span.getIn(['data', 'hangfire', 'jobid'])}</Di>
        <Di title="Name">{span.getIn(['data', 'hangfire', 'jobname'])}</Di>
        <Di title="Type">{span.getIn(['data', 'hangfire', 'jobtype'])}</Di>
      </Dl>
    </div>
  );
}
