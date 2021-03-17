/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'spring-batch',
  category: t('in-forge:tracingCategory.batch', 'batch'),

  detailView: 'SpringBatchSpanDetailView',

  getLabel(span) {
    const job = span.getIn(['data', 'batch', 'job']);
    const status = span.getIn(['data', 'batch', 'status']);

    if (job && status) {
      return job + ' ' + status;
    } else if (job) {
      return job;
    }
    return null;
  }
});
