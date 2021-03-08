/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'ejb',
  category: 'remote',

  typeName: {
    singular: t('in-forge:tracing.ejb.indexName'),
    plural: t('in-forge:tracing.ejb.indexName_plural')
  },

  detailView: 'EJBSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'ejb', 'method']);
  }
});
