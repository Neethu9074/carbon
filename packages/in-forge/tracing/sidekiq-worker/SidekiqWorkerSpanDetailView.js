/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function SidekiqWorkerSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.sidekiqWorker.job')}>{span.getIn(['data', 'sidekiq-worker', 'job'])}</Di>
      <Di title={t('in-forge:tracing.sidekiqWorker.queue')}>{span.getIn(['data', 'sidekiq-worker', 'queue'])}</Di>
      <Di title={t('in-forge:tracing.sidekiqWorker.retry')}>{span.getIn(['data', 'sidekiq-worker', 'retry'])}</Di>
      <Di title={t('in-forge:tracing.sidekiqWorker.jobId')}>{span.getIn(['data', 'sidekiq-worker', 'job_id'])}</Di>
    </Dl>
  );
}
