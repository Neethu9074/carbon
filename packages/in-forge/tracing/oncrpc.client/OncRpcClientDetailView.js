/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function OncRpcSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.oncrpcClient.host')}>{span.getIn(['data', 'oncrpc', 'host'])}</Di>
      <Di title={t('in-forge:tracing.oncrpcClient.port')}>{span.getIn(['data', 'oncrpc', 'port'])}</Di>
      <Di title={t('in-forge:tracing.oncrpcClient.program')}>{span.getIn(['data', 'oncrpc', 'program'])}</Di>
      <Di title={t('in-forge:tracing.oncrpcClient.procedure')}>{span.getIn(['data', 'oncrpc', 'procedure'])}</Di>
      <Di title={t('in-forge:tracing.oncrpcClient.version')}>{span.getIn(['data', 'oncrpc', 'version'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'oncrpc', 'error'])} />
    </Dl>
  );
}
