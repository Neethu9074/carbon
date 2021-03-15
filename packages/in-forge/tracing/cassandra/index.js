/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'cassandra',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.cassandra.indexName'),
    plural: t('in-forge:tracing.cassandra.indexName_plural')
  },

  detailView: 'CassandraSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'cassandra', 'query']);
  }
});
