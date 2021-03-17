/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'batch-synthetic',
  category: t('in-forge:tracingCategory.batch', 'batch'),

  detailView: 'SyntheticBatchSpanDetailView',

  getLabel() {
    return t('in-forge:tracing.batchSynthetic.indexReturn');
  }
});
