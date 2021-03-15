/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'mongo',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.mongo.indexName'),
    plural: t('in-forge:tracing.mongo.indexName_plural')
  },

  detailView: 'MongoSpanDetailView',

  groupingDetailView: 'MongoSpanGroupingDetailView',

  getLabel(span) {
    return span.getIn(['data', 'mongo', 'command']);
  }
});
