/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'batch-synthetic',
  category: 'batch',

  typeName: {
    singular: t('in-forge:tracing.batchSynthetic.indexName'),
    plural: t('in-forge:tracing.batchSynthetic.indexName_plural')
  },

  detailView: 'SyntheticBatchSpanDetailView',

  getLabel() {
    return t('in-forge:tracing.batchSynthetic.indexReturn');
  }
});
