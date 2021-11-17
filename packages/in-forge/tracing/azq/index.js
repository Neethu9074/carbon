/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'azq',
  category: t('in-forge:tracingCategory.messaging'),

  detailView: 'AzureQueueSpanDetailView',

  getLabel(span) {
    const queueName = span.getIn(['data', 'azq', 'queuename']);
    if (queueName == null) {
      return 'unknown';
    }
    return 'Azure Queue ' + queueName;
  }
});
