/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'jdbc',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.jdbc.indexName'),
    plural: t('in-forge:tracing.jdbc.indexName_plural')
  },

  detailView: 'JdbcSpanDetailView',

  groupingDetailView: 'JdbcSpanGroupingDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'jdbc', 'statement']);
    if (statement == null) {
      return span.getIn(['data', 'jdbc', 'connection']);
    }
    return shortenSqlStatement(statement);
  }
});
