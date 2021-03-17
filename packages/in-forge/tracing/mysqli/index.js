/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'mysqli',
  category: t('in-forge:tracingCategory.database', 'database'),

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
