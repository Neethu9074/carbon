/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'memcached',
  category: 'cache',

  typeName: {
    singular: t('in-forge:tracing.memcached.indexName'),
    plural: t('in-forge:tracing.memcached.indexName_plural')
  },

  detailView: 'MemcachedSpanDetailView',

  getLabel(span) {
    return t('in-forge:tracing.memcached.indexLabel', { labelData: span.getIn(['data', 'memcached', 'operation']) });
  }
});
