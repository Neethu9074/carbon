import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'resque-worker',
  category: 'messaging',

  typeName: {
    singular: 'Resque Worker',
    plural: 'Resque Job Processing'
  },

  detailView: 'ResqueWorkerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'resque-worker', 'job']);
  }
});
