import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'sns',
  category: 'messaging',

  typeName: {
    singular: 'SNS message',
    plural: 'SNS messages'
  },

  detailView: 'SnsSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'sns', 'topic']);
  }
});
