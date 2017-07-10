import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'memcache',
  category: 'cache',

  typeName: {
    singular: 'Memcache Call',
    plural: 'Memcache Calls'
  },

  detailView: 'MemcacheSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'memcache', 'command']);
  }
});
