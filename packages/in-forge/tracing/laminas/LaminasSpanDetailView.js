/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function LaminasSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.laminas.titleRoute')}>{span.getIn(['data', 'laminas', 'route'])}</Di>
        <Di title={t('in-forge:tracing.laminas.titleModule')}>{span.getIn(['data', 'laminas', 'module'])}</Di>
        <Di title={t('in-forge:tracing.laminas.titleController')}>{span.getIn(['data', 'laminas', 'controller'])}</Di>
        <Di title={t('in-forge:tracing.laminas.titleAction')}>{span.getIn(['data', 'laminas', 'action'])}</Di>
      </Dl>
    </div>
  );
}
