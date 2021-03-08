/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';

registerSpanDefinition({
  type: 'mysql',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.mysql.indexName'),
    plural: t('in-forge:tracing.mysql.indexName_plural')
  },

  detailView: 'MySqlSpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'mysql', 'stmt'], span.getIn(['data', 'mysql', 'sql']));
    if (statement != null) {
      return shortenSqlStatement(statement);
    }

    const db = span.getIn(['data', 'mysql', 'db']);
    if (db != null) {
      return db;
    }

    const host = span.getIn(['data', 'mysql', 'host']);
    if (host != null) {
      return host;
    }

    return t('in-forge:tracing.mysql.indexLabel');
  }
});
