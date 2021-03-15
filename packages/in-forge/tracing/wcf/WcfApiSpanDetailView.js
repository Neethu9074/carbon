/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function WebApiSpanDetailView({ span }) {
  const binding = span.getIn(['data', 'wcf', 'binding']);
  const error = span.getIn(['data', 'wcf', 'error']);

  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.wcf.serviceClass')}>{span.getIn(['data', 'wcf', 'svcclass'])}</Di>
        <Di title={t('in-forge:tracing.wcf.action')}>{span.getIn(['data', 'wcf', 'svcmethod'])}</Di>
        <Di title={t('in-forge:tracing.wcf.binding')}>{binding ? binding : 'unknown'}</Di>
        <Di title={t('in-forge:tracing.wcf.url')}>{span.getIn(['data', 'wcf', 'localaddress'])}</Di>
        <ErrorDescriptionItem error={error} />
      </Dl>
    </div>
  );
}
