/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function ResqueClientSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.resqueClient.job')}>{span.getIn(['data', 'resque-client', 'job'])}</Di>
      <Di title={t('in-forge:tracing.resqueClient.queue')}>{span.getIn(['data', 'resque-client', 'queue'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'resque-client', 'error'])} />
    </Dl>
  );
}
