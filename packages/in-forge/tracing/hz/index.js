/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'hz',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.hz.indexName'),
    plural: t('in-forge:tracing.hz.indexName_plural')
  },

  detailView: 'HzSpanDetailView'
});
