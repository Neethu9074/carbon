/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';
import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';

registerSpanDefinition({
  type: 'postgres',
  category: 'database',

  typeName: {
    singular: 'PostgreSQL Call',
    plural: 'PostgreSQL Calls'
  },

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

    return 'Unknown PostgreSQL call';
  }
});
