import { registerSpanDefinition } from 'in-sdk/tracing';
import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';

registerSpanDefinition({
  type: 'oci8',
  category: 'database',

  typeName: {
    singular: 'OCI8 Call',
    plural: 'OCI8 Calls'
  },

  detailView: 'OCI8SpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'oci8', 'stmt']);
    if (statement != null) {
      return shortenSqlStatement(statement);
    }

    const conn = span.getIn(['data', 'oci8', 'conn']);
    if (conn != null) {
      return conn;
    }

    return 'Unknown OCI8 call';
  }
});
