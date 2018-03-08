import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'kinesis',
  category: 'kinesis',

  typeName: {
    singular: 'Kinesis Stream call',
    plural: 'Kinesis Stream calls'
  },

  detailView: 'KinesisSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'kinesis', 'op']) + ' ' + span.getIn(['data', 'kinesis', 'stream']);
  }
});
