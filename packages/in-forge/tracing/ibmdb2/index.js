/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';

registerSpanDefinition({
  type: 'ibmdb2',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.ibmdb2.indexName'),
    plural: t('in-forge:tracing.ibmdb2.indexName_plural')
  },

  detailView: 'IbmDb2SpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'db2', 'stmt']);
    return shortenSqlStatement(statement);
  }
});
