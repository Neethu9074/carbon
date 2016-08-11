import {registerSpanDefinition} from 'in-sdk/registry/tracing';
import {shortenSqlStatement} from 'in-forge/tracing/jdbc/sql';

registerSpanDefinition({
  type: 'memcache',
  category: 'database',
  direction: 'exit',

  typeName: {
    singular: 'Memcache Call',
    plural: 'Memcache Calls'
  },

  detailView: 'MemcacheSpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'memcache', 'command']);
    return shortenSqlStatement(statement);
  }
});
