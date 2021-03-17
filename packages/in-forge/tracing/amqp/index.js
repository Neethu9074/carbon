/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'amqp',
  category: t('in-forge:tracingCategory.messaging', 'messaging'),

  detailView: 'AmqpSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'amqp', 'command']);
  }
});
