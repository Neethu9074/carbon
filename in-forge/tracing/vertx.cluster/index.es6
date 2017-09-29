import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'vertx.cluster',
  category: 'rpc',

  typeName: {
    singular: 'Vert.x cluster message',
    plural: 'Vert.x cluster messages'
  },

  detailView: 'VertxClusterSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'vertx', 'cluster', 'address']);
  }
});
