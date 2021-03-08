/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'couchbase',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.couchbase.indexName'),
    plural: t('in-forge:tracing.couchbase.indexName_plural')
  },

  detailView: 'CouchbaseSpanDetailView',

  getLabel(span) {
    return 'Couchbase ' + span.getIn(['data', 'couchbase', 'type']);
  }
});
