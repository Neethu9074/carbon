import { registerSpanDefinition } from 'in-sdk/tracing';
import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';

registerSpanDefinition({
  type: 'mysql',
  category: 'database',

  typeName: {
    singular: 'MySql Call',
    plural: 'MySql Calls'
  },

  detailView: 'MySqlSpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'mysql', 'stmt'], span.getIn(['data', 'mysql', 'sql']));
    const dsn = span.getIn(['data', 'mysql', 'host']);

    if (statement != null) {
      return shortenSqlStatement(statement);
    }

    if (dsn != null) {
      return dsn;
    }

    return 'Unknown database call';
  }
});
