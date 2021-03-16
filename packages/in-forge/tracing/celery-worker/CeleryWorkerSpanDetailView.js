/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function CeleryWorkerSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.celeryWorker.titleCeleryTask')}>{span.getIn(['data', 'celery', 'task'])}</Di>
      <Di title={t('in-forge:tracing.celeryWorker.titleCeleryTaskID')}>{span.getIn(['data', 'celery', 'task_id'])}</Di>
      <Di title={t('in-forge:tracing.celeryWorker.titleRetryReason')}>
        {span.getIn(['data', 'celery', 'retry-reason'])}
      </Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'celery', 'error'])} />
    </Dl>
  );
}
