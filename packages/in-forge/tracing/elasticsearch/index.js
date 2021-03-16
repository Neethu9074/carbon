/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'elasticsearch',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.elasticsearch.indexName'),
    plural: t('in-forge:tracing.elasticsearch.indexName_plural')
  },

  detailView: 'ElasticsearchSpanDetailView',

  groupingDetailView: 'ElasticsearchSpanGroupingDetailView',

  getLabel(span) {
    return span.getIn(['data', 'elasticsearch', 'action']);
  }
});
