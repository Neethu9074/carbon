/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'hangfire',
  category: 'batch',

  typeName: {
    singular: t('in-forge:tracing.hangfire.indexName'),
    plural: t('in-forge:tracing.hangfire.indexName_plural')
  },

  detailView: 'HangfireSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'hangfire', 'jobname']);
  }
});
