/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'hibernate',
  category: 'database',
  direction: 'local',

  typeName: {
    singular: t('in-forge:tracing.hibernate.indexName'),
    plural: t('in-forge:tracing.hibernate.indexName_plural')
  },

  detailView: 'HibernateSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'hibernate', 'type'], '') + span.getIn(['data', 'hibernate', 'sort'], '');
  }
});
