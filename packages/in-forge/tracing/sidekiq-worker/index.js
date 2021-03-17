/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'sidekiq-worker',
  category: t('in-forge:tracingCategory.messaging', 'messaging'),

  detailView: 'SidekiqWorkerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'sidekiq-worker', 'job']);
  }
});
