import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'mongo',

  typeName: {
    singular: 'MongoDB query',
    plural: 'MongoDB queries'
  },

  detailView: 'MongoSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'mongo', 'service']);
  }
});
