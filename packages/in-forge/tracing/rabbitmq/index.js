/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'rabbitmq',
  category: t('in-forge:tracingCategory.messaging'),

  detailView: 'RabbitMqSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'rabbitmq', 'key']);
  }
});
