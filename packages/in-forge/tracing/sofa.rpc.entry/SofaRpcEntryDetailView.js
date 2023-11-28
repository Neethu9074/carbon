/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function SofaRpcEntryDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.sofa.titleInterface')}>{span.getIn(['data', 'rpc', 'call'])}</Di>
        <Di title={t('in-forge:tracing.sofa.titleApplication')}>{span.getIn(['data', 'sofa', 'applicationName'])}</Di>
        <Di title={t('in-forge:tracing.sofa.titleMethod')}>{span.getIn(['data', 'sofa', 'methodName'])}</Di>
        <Di title={t('in-forge:tracing.rpc.flavor')}>{span.getIn(['data', 'rpc', 'flavor'])}</Di>
        <Di title={t('in-forge:tracing.rpc.host')}>{span.getIn(['data', 'rpc', 'host'])}</Di>
        <Di title={t('in-forge:tracing.rpc.remotePort')}>{span.getIn(['data', 'rpc', 'port'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'rpc', 'error'])} />
      </Dl>
    </div>
  );
}
