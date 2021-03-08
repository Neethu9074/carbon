/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'mule.client',
  category: 'http',

  typeName: {
    singular: t('in-forge:tracing.muleClient.indexName'),
    plural: t('in-forge:tracing.muleClient.indexName_plural')
  },

  detailView: 'MuleClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'mule', 'address']);
  }
});
