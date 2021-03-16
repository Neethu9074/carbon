/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function HangfireSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.hangfire.titleId')}>{span.getIn(['data', 'hangfire', 'jobid'])}</Di>
        <Di title={t('in-forge:tracing.hangfire.titleName')}>{span.getIn(['data', 'hangfire', 'jobname'])}</Di>
        <Di title={t('in-forge:tracing.hangfire.titleType')}>{span.getIn(['data', 'hangfire', 'jobtype'])}</Di>
      </Dl>
    </div>
  );
}
