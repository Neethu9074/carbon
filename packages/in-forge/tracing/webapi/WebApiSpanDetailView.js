/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function WebApiSpanDetailView({ span }) {
  const controller = span.getIn(['data', 'webapi', 'controller']);
  const error = span.getIn(['data', 'webapi', 'error']);

  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.webapi.controller')}>{controller ? controller : 'unknown'}</Di>
        <Di title={t('in-forge:tracing.webapi.action')}>{span.getIn(['data', 'webapi', 'action'])}</Di>
        <Di title={t('in-forge:tracing.webapi.url')}>{span.getIn(['data', 'webapi', 'url'])}</Di>
        <ErrorDescriptionItem error={error} />
      </Dl>
    </div>
  );
}
