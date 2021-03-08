/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function JBossSchedulerSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.jboss.titleJob')}>{span.getIn(['data', 'jboss', 'name'])}</Di>
        <Di title={t('in-forge:tracing.jboss.titleParameters')}>{span.getIn(['data', 'jboss', 'parameters'])}</Di>
        <Di title={t('in-forge:tracing.jboss.titleError')}>{span.getIn(['data', 'jboss', 'error'])}</Di>
      </Dl>
    </div>
  );
}
