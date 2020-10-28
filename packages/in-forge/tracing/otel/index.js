import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'otel',
  category: 'generic',

  typeName: {
    singular: 'Call',
    plural: 'Calls'
  },

  detailView: 'OTelSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'service']) + ' ' + span.getIn(['data', 'operation']);
  }
});
