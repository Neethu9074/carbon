/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function RpcSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.rpc.flavor')}>{span.getIn(['data', 'rpc', 'flavor'])}</Di>
      <Di title={t('in-forge:tracing.rpc.host')}>{span.getIn(['data', 'rpc', 'host'])}</Di>
      <Di title={t('in-forge:tracing.rpc.remotePort')}>{span.getIn(['data', 'rpc', 'port'])}</Di>
      <Di title={t('in-forge:tracing.rpc.procedureMethod')}>{span.getIn(['data', 'rpc', 'call'])}</Di>
      <Di title={t('in-forge:tracing.rpc.callType')}>{span.getIn(['data', 'rpc', 'call_type'])}</Di>
      <Di title={t('in-forge:tracing.rpc.parameters')}>{span.getIn(['data', 'rpc', 'params'])}</Di>
      <Di title={t('in-forge:tracing.rpc.baggage')}>{span.getIn(['data', 'rpc', 'baggage'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'rpc', 'error'])} />
    </Dl>
  );
}
