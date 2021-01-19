/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';
import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';

registerSpanDefinition({
  type: 'mysql',
  category: 'database',

  typeName: {
    singular: 'MySQL Call',
    plural: 'MySQL Calls'
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

    return 'Unknown MySQL call';
  }
});
