/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'redis',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'RedisSpanDetailView',
  getLabel(span) {
    return span.getIn(['data', 'redis', 'command']);
  }
});
