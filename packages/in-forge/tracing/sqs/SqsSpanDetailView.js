/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function SqsSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.sqs.queue')}>{span.getIn(['data', 'sqs', 'queue'])}</Di>
        <Di title={t('in-forge:tracing.sqs.batchSize')}>{span.getIn(['data', 'sqs', 'size'])}</Di>
        <Di title={t('in-forge:tracing.sqs.type')}>{span.getIn(['data', 'sqs', 'type'])}</Di>
        <Di title={t('in-forge:tracing.sqs.responseCode')}>{span.getIn(['data', 'sqs', 'responseCode'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'sqs', 'error'])} />
      </Dl>
    </div>
  );
}
