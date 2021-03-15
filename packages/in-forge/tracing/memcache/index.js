/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'memcache',
  category: 'cache',

  typeName: {
    singular: t('in-forge:tracing.memcache.indexName'),
    plural: t('in-forge:tracing.memcache.indexName_plural')
  },

  detailView: 'MemcacheSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'memcache', 'command']);
  }
});
