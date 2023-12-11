/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'azstorage',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'AzureStorageSpanDetailView',

  getLabel(span) {
    const operation = span.getIn(['data', 'azstorage', 'op']);
    const containerName = span.getIn(['data', 'azstorage', 'containerName']);
    const blobName = span.getIn(['data', 'azstorage', 'blobName']);
    return [operation, containerName, blobName].join(' ');
  }
});
