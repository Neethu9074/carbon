import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'boto3',
  category: 'http',

  typeName: {
    singular: 'boto3 Call',
    plural: 'boto3 Calls'
  },

  detailView: 'Boto3SpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'boto3', 'op']);
  }
});
