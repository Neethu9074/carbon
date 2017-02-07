import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'memcached',
  category: 'database',

  typeName: {
    singular: 'Memcached Call',
    plural: 'Memcached Calls'
  },

  detailView: 'MemcachedSpanDetailView',

  getLabel(span) {
    return 'Memcached ' + span.getIn(['data', 'memcached', 'operation']);
  }
});
