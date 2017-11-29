import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'missing',
  category: 'missing',

  typeName: {
    singular: 'Span not yet received',
    plural: 'Spans not yet received'
  },

  detailView: 'MissingSpanDetailView',

  getLabel() {
    return 'The span did not yet arrive in the backend (e.g. long running tasks)';
  }
});
