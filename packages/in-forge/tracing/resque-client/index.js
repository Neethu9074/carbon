import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'resque-client',
  category: 'messaging',

  typeName: {
    singular: 'Resque Client',
    plural: 'Resque Client Calls'
  },

  detailView: 'ResqueClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'resque-client', 'job']);
  }
});
