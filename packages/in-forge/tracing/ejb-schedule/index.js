/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'ejb-schedule',
  category: t('in-forge:tracingCategory.batch'),

  detailView: 'EJBScheduleSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'ejb', 'schedule', 'id']);
  }
});
