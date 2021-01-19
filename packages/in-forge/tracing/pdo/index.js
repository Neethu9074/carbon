/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';
import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';

registerSpanDefinition({
  type: 'pdo',
  category: 'database',

  typeName: {
    singular: 'PDO Call',
    plural: 'PDO Calls'
  },

  detailView: 'PdoSpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'pdo', 'stmt']);
    if (statement == null) {
      return span.getIn(['data', 'pdo', 'dsn']) + '(' + span.getIn(['data', 'pdo', 'driver']) + ')';
    }
    return shortenSqlStatement(statement);
  }
});
