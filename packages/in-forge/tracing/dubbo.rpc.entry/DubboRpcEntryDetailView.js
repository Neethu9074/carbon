/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function DubboRpcEntryDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.dubbo.titlePath')}>{span.getIn(['data', 'dubbo', 'path'])}</Di>
        <Di title={t('in-forge:tracing.dubbo.titleInterface')}>{span.getIn(['data', 'dubbo', 'interface'])}</Di>
        <Di title={t('in-forge:tracing.dubbo.titleGroup')}>{span.getIn(['data', 'dubbo', 'group'])}</Di>
        <Di title={t('in-forge:tracing.dubbo.titleMethod')}>{span.getIn(['data', 'dubbo', 'method'])}</Di>
        <Di title={t('in-forge:tracing.dubbo.titleProviderVersion')}>
          {span.getIn(['data', 'dubbo', 'provider', 'version'])}
        </Di>
        <Di title={t('in-forge:tracing.dubbo.titleVersion')}>{span.getIn(['data', 'dubbo', 'version'])}</Di>
        <Di title={t('in-forge:tracing.rpc.host')}>{span.getIn(['data', 'rpc', 'host'])}</Di>
        <Di title={t('in-forge:tracing.rpc.remotePort')}>{span.getIn(['data', 'rpc', 'port'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'rpc', 'error'])} />
      </Dl>
    </div>
  );
}
