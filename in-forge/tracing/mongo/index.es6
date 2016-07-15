import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'mongo',
  category: 'database',
  direction: 'exit',

  typeName: {
    singular: 'MongoDB query',
    plural: 'MongoDB queries'
  },

  detailView: 'MongoSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'mongo', 'command']);
  }
});
