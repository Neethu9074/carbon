/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'vertx.redis',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'VertxRedisSpanDetailView',
  getLabel(span) {
    return span.getIn(['data', 'vertx', 'redis', 'cmd']);
  }
});
