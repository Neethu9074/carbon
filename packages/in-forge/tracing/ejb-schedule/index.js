/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'ejb-schedule',
  category: 'batch',

  typeName: {
    singular: t('in-forge:tracing.ejbSchedule.indexName'),
    plural: t('in-forge:tracing.ejbSchedule.indexName_plural')
  },

  detailView: 'EJBScheduleSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'ejb', 'schedule', 'id']);
  }
});
