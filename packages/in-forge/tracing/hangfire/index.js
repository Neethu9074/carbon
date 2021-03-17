/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'hangfire',
  category: t('in-forge:tracingCategory.batch', 'batch'),

  detailView: 'HangfireSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'hangfire', 'jobname']);
  }
});
