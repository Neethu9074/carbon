/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function SpringBatchSpanDetailView({ span }) {
  const error = span.getIn(['data', 'batch', 'error']);

  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.springBatch.job')}>{span.getIn(['data', 'batch', 'job'])}</Di>
        <Di title={t('in-forge:tracing.springBatch.parameters')}>{span.getIn(['data', 'batch', 'parameters'])}</Di>
        <Di title={t('in-forge:tracing.springBatch.exitStatus')}>{span.getIn(['data', 'batch', 'status'])}</Di>
        {error ? (
          <Di title={t('in-forge:tracing.springBatch.error')} verticalDisplay>
            <ErrorDescriptionItem error={error} />
          </Di>
        ) : null}
      </Dl>
    </div>
  );
}
