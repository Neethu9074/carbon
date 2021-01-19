/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'sdk.database',
  category: 'database',

  typeName: {
    singular: 'Database Call',
    plural: 'Database Calls'
  },

  detailView: 'DatabaseSpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'db', 'statement']);
    if (statement == null) {
      return span.getIn(['data', 'db', 'type']);
    }
    return shortenSqlStatement(statement);
  }
});
