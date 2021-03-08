/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'distributeme.client',
  category: 'remote',

  typeName: {
    singular: t('in-forge:tracing.distributemeClient.indexName'),
    plural: t('in-forge:tracing.distributemeClient.indexName_plural')
  },

  detailView: 'DistributeMeClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'distributeme', 'service'], 'Unkown');
  }
});
