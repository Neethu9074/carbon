/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'celery-worker',
  category: 'messaging',

  typeName: {
    singular: t('in-forge:tracing.celeryWorker.indexName'),
    plural: t('in-forge:tracing.celeryWorker.indexName_plural')
  },

  detailView: 'CeleryWorkerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'celery', 'task']);
  }
});
