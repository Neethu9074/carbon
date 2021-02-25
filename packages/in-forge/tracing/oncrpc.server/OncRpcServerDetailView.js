/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function OncRpcSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.oncrpcServer.program')}>{span.getIn(['data', 'oncrpc', 'program'])}</Di>
      <Di title={t('in-forge:tracing.oncrpcServer.procedure')}>{span.getIn(['data', 'oncrpc', 'procedure'])}</Di>
      <Di title={t('in-forge:tracing.oncrpcServer.version')}>{span.getIn(['data', 'oncrpc', 'version'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'oncrpc', 'error'])} />
    </Dl>
  );
}
