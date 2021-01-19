/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function SidekiqClientSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Job">{span.getIn(['data', 'sidekiq-client', 'job'])}</Di>
      <Di title="Queue">{span.getIn(['data', 'sidekiq-client', 'queue'])}</Di>
      <Di title="Retry">{span.getIn(['data', 'sidekiq-client', 'retry'])}</Di>
      <Di title="Job ID">{span.getIn(['data', 'sidekiq-client', 'job_id'])}</Di>
    </Dl>
  );
}
