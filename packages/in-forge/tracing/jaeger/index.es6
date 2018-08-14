import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'jaeger',
  category: 'generic',

  typeName: {
    singular: 'Call',
    plural: 'Calls'
  },

  detailView: 'JaegerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'service']) + ' ' + span.getIn(['data', 'operation']);
  }
});
