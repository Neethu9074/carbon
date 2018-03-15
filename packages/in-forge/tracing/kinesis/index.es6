import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'kinesis',
  category: 'messaging',

  typeName: {
    singular: 'Kinesis',
    plural: 'Kinesis'
  },

  detailView: 'KinesisSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'kinesis', 'op']) + ' on ' + span.getIn(['data', 'kinesis', 'stream']);
  }
});
