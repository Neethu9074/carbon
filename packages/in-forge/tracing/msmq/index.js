/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'msmq',
  category: 'messaging',

  typeName: {
    singular: t('in-forge:tracing.msmq.indexName'),
    plural: t('in-forge:tracing.msmq.indexName_plural')
  },

  detailView: 'MSMQSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'msmq', 'queueName']);
  }
});
