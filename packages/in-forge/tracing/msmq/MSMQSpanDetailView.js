/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function MSMQSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.msmq.titleMachine')}>{span.getIn(['data', 'msmq', 'machineName'])}</Di>
        <Di title={t('in-forge:tracing.msmq.titleQueue')}>{span.getIn(['data', 'msmq', 'queueName'])}</Di>
        <Di title={t('in-forge:tracing.msmq.titleOperation')}>{span.getIn(['data', 'msmq', 'operation'])}</Di>
        <Di title={t('in-forge:tracing.msmq.titleTransactionType')}>{span.getIn(['data', 'msmq', 'txType'])}</Di>
      </Dl>
    </div>
  );
}
