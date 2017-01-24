import {registerSpanDefinition} from 'in-sdk/tracing';
import {shortenSqlStatement} from 'in-forge/tracing/jdbc/sql';

registerSpanDefinition({
  type: 'jdbc',
  category: 'database',

  typeName: {
    singular: 'JDBC Call',
    plural: 'JDBC Calls'
  },

  detailView: 'JdbcSpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'jdbc', 'statement']);
    if (statement == null) {
      return span.getIn(['data', 'jdbc', 'connection']);
    }
    return shortenSqlStatement(statement);
  }
});
