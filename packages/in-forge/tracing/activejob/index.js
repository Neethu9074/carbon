/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'activejob',
  category: t('in-forge:tracingCategory.messaging'),

  detailView: 'ActiveJobSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'activejob', 'job']);
  }
});
