/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';
import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';

registerSpanDefinition({
  type: 'ibmdb2',
  category: 'database',

  typeName: {
    singular: 'IBM DB2 Universal Database, IBM Cloudscape, and Apache Derby Call',
    plural: 'IBM DB2 Universal Database, IBM Cloudscape, and Apache Derby Calls'
  },

  detailView: 'IbmDb2SpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'db2', 'stmt']);
    return shortenSqlStatement(statement);
  }
});
