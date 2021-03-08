/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'mule.server',
  category: 'http',

  typeName: {
    singular: t('in-forge:tracing.muleServer.indexName'),
    plural: t('in-forge:tracing.muleServer.indexName_plural')
  },


  detailView: 'MuleServerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'mule', 'address']);
  }
});
