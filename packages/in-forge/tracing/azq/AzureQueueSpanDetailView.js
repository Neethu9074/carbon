/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function AzureQueueSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.azq.queuename')}>{span.getIn(['data', 'azq', 'queuename'])}</Di>
        <Di title={t('in-forge:tracing.azq.messagesuri')}>{span.getIn(['data', 'azq', 'messagesuri'])}</Di>
        <Di title={t('in-forge:tracing.azq.storageaccountname')}>{span.getIn(['data', 'azq', 'storageaccountname'])}</Di>
        <Di title={t('in-forge:tracing.azq.queueuri')}>{span.getIn(['data', 'azq', 'queueuri'])}</Di>
        <Di title={t('in-forge:tracing.azq.methodname')}>{span.getIn(['data', 'azq', 'methodname'])}</Di>
      </Dl>
    </div>
  );
}