import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'hz',
  category: 'database',

  typeName: {
    singular: 'Hazelcast Java Client call',
    plural: 'Hazelcast Java Client calls'
  },

  detailView: 'HzSpanDetailView'
});
