/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'sdk.batch',
  category: t('in-forge:tracingCategory.batch', 'batch'),

  detailView: 'BatchSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'batch', 'job']);
  }
});
