/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'corba.client',
  category: 'remote',

  typeName: {
    singular: t('in-forge:tracing.corbaClient.indexName'),
    plural: t('in-forge:tracing.corbaClient.indexName_plural')
  },

  detailView: 'CorbaClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'corba', 'method']);
  }
});
