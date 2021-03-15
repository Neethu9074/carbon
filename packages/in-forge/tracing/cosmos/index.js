/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'cosmos',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.cosmos.indexName'),
    plural: t('in-forge:tracing.cosmos.indexName_plural')
  },

  detailView: 'CosmosSpanDetailView',

  getLabel(span) {
    return shortenSqlStatement(span.getIn(['data', 'cosmos', 'cmd'], ''));
  }
});
