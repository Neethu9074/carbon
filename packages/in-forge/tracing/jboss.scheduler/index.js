/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'jboss.scheduler',
  category: 'batch',

  typeName: {
    singular: t('in-forge:tracing.jboss.indexName'),
    plural: t('in-forge:tracing.jboss.indexName_plural')
  },

  detailView: 'JBossSchedulerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'jboss', 'name']);
  }
});
