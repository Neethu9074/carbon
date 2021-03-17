/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'msmq',
  category: t('in-forge:tracingCategory.messaging', 'messaging'),

  detailView: 'MSMQSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'msmq', 'queueName']);
  }
});
