/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

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
