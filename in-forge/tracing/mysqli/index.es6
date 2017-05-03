import { registerSpanDefinition } from 'in-sdk/tracing';
import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';

registerSpanDefinition({
  type: 'mysqli',
  category: 'database',

  typeName: {
    singular: 'MySql Call',
    plural: 'MySql Calls'
  },

  detailView: 'MySQLiSpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'mysqli', 'stmt']);
    const dsn = span.getIn(['data', 'mysqli', 'dsn']);

    if (statement != null) {
      return shortenSqlStatement(statement);
    }

    if (dsn != null) {
      return dsn;
    }

    return 'Unknown database call';
  }
});
