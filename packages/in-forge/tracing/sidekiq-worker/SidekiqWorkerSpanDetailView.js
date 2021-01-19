/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function SidekiqWorkerSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Job">{span.getIn(['data', 'sidekiq-worker', 'job'])}</Di>
      <Di title="Queue">{span.getIn(['data', 'sidekiq-worker', 'queue'])}</Di>
      <Di title="Retry">{span.getIn(['data', 'sidekiq-worker', 'retry'])}</Di>
      <Di title="Job ID">{span.getIn(['data', 'sidekiq-worker', 'job_id'])}</Di>
    </Dl>
  );
}
