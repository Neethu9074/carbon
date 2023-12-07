/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function AzureQueueSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.azstorage.containerName')}>{span.getIn(['data', 'azstorage', 'queuename'])}</Di>
        <Di title={t('in-forge:tracing.azstorage.blobName')}>{span.getIn(['data', 'azstorage', 'blobName'])}</Di>
        <Di title={t('in-forge:tracing.azstorage.operation')}>{span.getIn(['data', 'azstorage', 'op'])}</Di>
        <Di title={t('in-forge:tracing.azstorage.storageaccountname')}>
          {span.getIn(['data', 'azstorage', 'accountName'])}
        </Di>
      </Dl>
    </div>
  );
}
