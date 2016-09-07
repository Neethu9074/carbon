import {registerSpanDefinition} from 'in-sdk/tracing';
import {shortenSqlStatement} from 'in-forge/tracing/jdbc/sql';

registerSpanDefinition({
  type: 'mysqli',
  category: 'database',
  direction: 'exit',

  typeName: {
    singular: 'MySql Call',
    plural: 'MySql Calls'
  },

  detailView: 'MySQLiSpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'mysqli', 'stmt']);
    return shortenSqlStatement(statement);
  }
});
