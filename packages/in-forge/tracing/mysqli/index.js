/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';

registerSpanDefinition({
  type: 'mysqli',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.mysqli.indexName'),
    plural: t('in-forge:tracing.mysqli.indexName_plural')
  },

  detailView: 'MySQLiSpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'mysqli', 'stmt']);
    if (statement != null) {
      return shortenSqlStatement(statement);
    }

    const dsn = span.getIn(['data', 'mysqli', 'dsn']);
    if (dsn != null) {
      return dsn;
    }

    return t('in-forge:tracing.mysqli.indexLabel');
  }
});
