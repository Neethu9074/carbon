/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function DataPowerInternalSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.http.titleRequestPath')}>{span.getIn(['data', 'http', 'path'])}</Di>
        <Di title={t('in-forge:tracing.http.titleURL')}>{span.getIn(['data', 'http', 'url'])}</Di>
        <Di title={t('in-forge:tracing.http.titleMethod')}>{span.getIn(['data', 'http', 'method'])}</Di>
        <Di title={t('in-forge:tracing.http.titleStatusCode')}>{span.getIn(['data', 'http', 'status'])}</Di>
      </Dl>
    </div>
  );
}
