/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function ActiveJobSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.activejob.job')}>{span.getIn(['data', 'activejob', 'job'])}</Di>
      <Di title={t('in-forge:tracing.activejob.queue')}>{span.getIn(['data', 'activejob', 'queue'])}</Di>
      <Di title={t('in-forge:tracing.activejob.jobId')}>{span.getIn(['data', 'activejob', 'job_id'])}</Di>
    </Dl>
  );
}
