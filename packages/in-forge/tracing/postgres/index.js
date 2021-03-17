/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'postgres',
  category: t('in-forge:tracingCategory.database', 'database'),

  detailView: 'PostgresSpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'pg', 'stmt'], span.getIn(['data', 'pg', 'sql']));
    if (statement != null) {
      return shortenSqlStatement(statement);
    }

    const db = span.getIn(['data', 'pg', 'db']);
    if (db != null) {
      return db;
    }

    const host = span.getIn(['data', 'pg', 'host']);
    if (host != null) {
      return host;
    }

    return t('in-forge:tracing.postgres.unknownPostgreSqlCall');
  }
});
