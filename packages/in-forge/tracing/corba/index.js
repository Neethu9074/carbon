/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'corba',
  category: 'remote',

  typeName: {
    singular: t('in-forge:tracing.corba.indexName'),
    plural: t('in-forge:tracing.corba.indexName_plural')
  },

  detailView: 'CorbaSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'corba', 'method']);
  }
});
