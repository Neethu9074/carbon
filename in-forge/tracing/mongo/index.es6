import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'mongo',
  category: 'database',

  typeName: {
    singular: 'MongoDB query',
    plural: 'MongoDB queries'
  },

  detailView: 'MongoSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'mongo', 'command']);
  }
});
