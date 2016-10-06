import {registerSpanDefinition} from 'in-sdk/tracing';


registerSpanDefinition({
  type: 'missing',
  category: 'missing',
  direction: 'entryAndExit',

  typeName: {
    singular: 'Missing Span',
    plural: 'Missing Spans'
  },

  detailView: 'MissingSpanDetailView',

  getLabel: () => 'The span did not yet arrive in the backend (e.g. long running tasks)'
});
