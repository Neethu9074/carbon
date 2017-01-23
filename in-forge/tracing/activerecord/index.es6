import {registerSpanDefinition} from 'in-sdk/tracing';
import {shortenSqlStatement} from 'in-forge/tracing/jdbc/sql';

registerSpanDefinition({
  type: 'activerecord',
  category: 'database',
  direction: 'exit',

  typeName: {
    singular: 'ActiveRecord',
    plural: 'ActiveRecord Calls'
  },

  detailView: 'ActiveRecordSpanDetailView',

  getLabel(span) {
    return shortenSqlStatement(span.getIn(['data', 'activerecord', 'sql']));
  }
});
