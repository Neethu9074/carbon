/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'missing',
  category: 'missing',

  typeName: {
    singular: t('in-forge:tracing.missing.indexName'),
    plural: t('in-forge:tracing.missing.indexName_plural')
  },

  detailView: 'MissingSpanDetailView',

  getLabel() {
    return t('in-forge:tracing.missing.indexLabel');
  }
});
