/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'resque-worker',
  category: t('in-forge:tracingCategory.messaging', 'messaging'),

  detailView: 'ResqueWorkerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'resque-worker', 'job']);
  }
});
