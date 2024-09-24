/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card } from '@instana/components';

import SidebarTagList from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/SidebarTagList';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

import locals from './OTelSpanDetailsView.mless';

export default function OTelSpanDetailView({ span }) {
  const error = span.getIn(['data', 'error']);
  const errorDetail = span.getIn(['data', 'error_detail']);
  const traceState = span.getIn(['data', 'trace_state']);

  const toKeyValueMap = map => Object.entries(map).map(([name, value]) => ({ name, value }));
  const tags = toKeyValueMap(span.getIn(['data', 'tags'], emptyMap).toJS());
  const resource = toKeyValueMap(span.getIn(['data', 'resource'], emptyMap).toJS());

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
      </Dl>
      <Card title={t('in-forge:tracing.otel.tags')} hasMarginBottom>
        <SidebarTagList tags={tags} />
      </Card>
      <Card title={t('in-forge:tracing.otel.resource')} hasMarginBottom>
        <SidebarTagList tags={resource} />
      </Card>
    </div>
  );
}
