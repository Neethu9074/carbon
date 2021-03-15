/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'ehcache',
  category: 'cache',

  typeName: {
    singular: t('in-forge:tracing.ehcache.indexName'),
    plural: t('in-forge:tracing.ehcache.indexName_plural')
  },

  detailView: 'EhcacheSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'action']) + ' ' + span.getIn(['data', 'name']);
  }
});
