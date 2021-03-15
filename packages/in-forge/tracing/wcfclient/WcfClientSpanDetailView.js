/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function WebApiSpanDetailView({ span }) {
  const binding = span.getIn(['data', 'wcfclient', 'binding']);
  const oneway = span.getIn(['data', 'wcfclient', 'oneway']);
  const channeltype = span.getIn(['data', 'wcfclient', 'channel']);
  const error = span.getIn(['data', 'wcfclient', 'error']);

  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.wcfclient.url')}>{span.getIn(['data', 'wcfclient', 'url'])}</Di>
        <Di title={t('in-forge:tracing.wcfclient.contractType')}>{span.getIn(['data', 'wcfclient', 'service'])}</Di>
        <Di title={t('in-forge:tracing.wcfclient.method')}>{span.getIn(['data', 'wcfclient', 'method'])}</Di>
        <Di title={t('in-forge:tracing.wcfclient.binding')}>{binding ? binding : 'unknown'}</Di>
        <Di title={t('in-forge:tracing.wcfclient.oneway')}>{oneway ? oneway : 'no'}</Di>
        <Di title={t('in-forge:tracing.wcfclient.channel')}>{channeltype ? channeltype : 'unknown'}</Di>
        <ErrorDescriptionItem error={error} />
      </Dl>
    </div>
  );
}
