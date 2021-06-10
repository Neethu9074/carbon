/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function SidekiqClientSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.sidekiqClient.job')}>{span.getIn(['data', 'sidekiq-client', 'job'])}</Di>
      <Di title={t('in-forge:tracing.sidekiqClient.queue')}>{span.getIn(['data', 'sidekiq-client', 'queue'])}</Di>
      <Di title={t('in-forge:tracing.sidekiqClient.retry')}>{span.getIn(['data', 'sidekiq-client', 'retry'])}</Di>
      <Di title={t('in-forge:tracing.sidekiqClient.jobId')}>{span.getIn(['data', 'sidekiq-client', 'job_id'])}</Di>
    </Dl>
  );
}
