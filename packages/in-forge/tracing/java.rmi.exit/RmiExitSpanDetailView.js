/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function RmiExitSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.javaRmiExit.titleHost')}>{span.getIn(['data', 'rmi', 'host'])}</Di>
      <Di title={t('in-forge:tracing.javaRmiExit.titleMethod')}>{span.getIn(['data', 'rmi', 'method'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'rmi', 'error'])} />
    </Dl>
  );
}
