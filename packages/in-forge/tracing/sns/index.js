/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'sns',
  category: t('in-forge:tracingCategory.messaging', 'messaging'),

  detailView: 'SnsSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'sns', 'topic']);
  }
});
