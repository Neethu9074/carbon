/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';
import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';

registerSpanDefinition({
  type: 'mysqli',
  category: 'database',

  typeName: {
    singular: 'MySQL Call',
    plural: 'MySQL Calls'
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

    return 'Unknown MySQL call';
  }
});
