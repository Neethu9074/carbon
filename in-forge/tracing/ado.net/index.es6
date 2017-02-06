import {registerSpanDefinition} from 'in-sdk/tracing';
import {shortenSqlStatement} from 'in-forge/tracing/jdbc/sql';

registerSpanDefinition({
  type: 'ado.net',
  category: 'database',

  typeName: {
    singular: 'ADO Call',
    plural: 'ADO Calls'
  },

  detailView: 'AdoNetSpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'ado', 'command']);
    if (statement == null) {
      return span.getIn(['data', 'ado', 'connection']);
    }
    return shortenSqlStatement(statement);
  }
});
