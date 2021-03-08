/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'celery-client',
  category: 'messaging',

  typeName: {
    singular: t('in-forge:tracing.celeryClient.indexName'),
    plural: t('in-forge:tracing.celeryClient.indexName_plural')
  },

  detailView: 'CeleryClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'celery', 'task']);
  }
});
