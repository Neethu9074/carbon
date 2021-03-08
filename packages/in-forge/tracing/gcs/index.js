/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'gcs',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.gcs.indexName'),
    plural: t('in-forge:tracing.gcs.indexName_plural')
  },

  detailView: 'GCSSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'gcs', 'op']);
  }
});
