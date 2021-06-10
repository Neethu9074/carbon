/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function ResqueWorkerSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.resqueWorker.job')}>{span.getIn(['data', 'resque-worker', 'job'])}</Di>
      <Di title={t('in-forge:tracing.resqueWorker.queue')}>{span.getIn(['data', 'resque-worker', 'queue'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'resque-worker', 'error'])} />
    </Dl>
  );
}
