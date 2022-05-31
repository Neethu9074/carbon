/*
 * (c) Copyright IBM Corp. 2021
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
        <Di title={t('in-forge:tracing.rpc.procedureMethod')}>{span.getIn(['data', 'rpc', 'call'])}</Di>
        <Di title={t('in-forge:tracing.rpc.host')}>{span.getIn(['data', 'rpc', 'host'])}</Di>
        <Di title={t('in-forge:tracing.rpc.remotePort')}>{span.getIn(['data', 'rpc', 'port'])}</Di>
        <Di title={t('in-forge:tracing.dubbo.titleRequestType')}>{span.getIn(['data', 'dubbo', 'request', 'type'])}</Di>
        <Di title={t('in-forge:tracing.dubbo.titlePath')}>{span.getIn(['data', 'dubbo', 'path'])}</Di>
        <Di title={t('in-forge:tracing.dubbo.titleInterface')}>{span.getIn(['data', 'dubbo', 'interface'])}</Di>
        <Di title={t('in-forge:tracing.dubbo.titleGroup')}>{span.getIn(['data', 'dubbo', 'group'])}</Di>
        <Di title={t('in-forge:tracing.dubbo.titleProviderVersion')}>
          {span.getIn(['data', 'dubbo', 'provider', 'version'])}
        </Di>
        <Di title={t('in-forge:tracing.dubbo.titleVersion')}>{span.getIn(['data', 'dubbo', 'version'])}</Di>
        <Di title={t('in-forge:tracing.dubbo.titleTag')}>{span.getIn(['data', 'dubbo', 'tag'])}</Di>
        <Di title={t('in-forge:tracing.dubbo.titleToken')}>{span.getIn(['data', 'dubbo', 'token'])}</Di>
        <Di title={t('in-forge:tracing.dubbo.titleRemoteApplication')}>
          {span.getIn(['data', 'dubbo', 'remote', 'application'])}
        </Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'rpc', 'error'])} />
      </Dl>
    </div>
  );
}
