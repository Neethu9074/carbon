/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

import locals from './OTelSpanDetailsView.mless';

export default function OTelSpanDetailView({ span }) {
  const error = span.getIn(['data', 'error']);
  const errorDetail = span.getIn(['data', 'error_detail']);
  const traceState = span.getIn(['data', 'trace_state']);

  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.otel.service')}>{span.getIn(['data', 'service'])}</Di>
        <Di title={t('in-forge:tracing.otel.operation')}>{span.getIn(['data', 'operation'])}</Di>
        {traceState != null && <Di title={t('in-forge:tracing.otel.traceState')}>{traceState}</Di>}
        {error != null && (
          <Di title={t('in-forge:tracing.otel.error')} rowClassName={locals.error}>
            {error}
            {errorDetail != null && ` – ${errorDetail}`}
          </Di>
        )}
        <Di title={t('in-forge:tracing.otel.tags')} verticalDisplay>
          <Code code={JSON.stringify(span.getIn(['data', 'tags'], emptyMap).toJS(), 0, 2)} lang="json" />
        </Di>
      </Dl>
    </div>
  );
}
