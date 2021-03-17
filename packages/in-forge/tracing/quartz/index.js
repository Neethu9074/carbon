/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'quartz',
  category: t('in-forge:tracingCategory.batch', 'batch'),

  detailView: 'QuartzSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'quartz', 'name']);
  }
});
