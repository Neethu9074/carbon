/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'resque-client',
  category: t('in-forge:tracingCategory.messaging'),

  detailView: 'ResqueClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'resque-client', 'job']);
  }
});
