/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'couchbase',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'CouchbaseSpanDetailView',

  getLabel(span) {
    return 'Couchbase ' + span.getIn(['data', 'couchbase', 'type']);
  }
});
