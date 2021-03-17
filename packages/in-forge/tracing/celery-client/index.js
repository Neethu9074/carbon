/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'celery-client',
  category: t('in-forge:tracingCategory.messaging', 'messaging'),

  detailView: 'CeleryClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'celery', 'task']);
  }
});
