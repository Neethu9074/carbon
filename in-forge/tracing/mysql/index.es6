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
    const statement = span.getIn(['data', 'mysql', 'sql']);
    return shortenSqlStatement(statement);
  }
});
