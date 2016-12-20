import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'kafka',
  category: 'messaging',
  direction(span) {
    const access = span.getIn(['data', 'kafka', 'access'], 'send');
    return access.toLowerCase() === 'send' ? 'exit' : 'entry';
  },

  typeName: {
    singular: 'Kafka',
    plural: 'Kafka'
  },

  detailView: 'KafkaSpanDetailView',

  getLabel(span) {
    return `${span.getIn(['data', 'kafka', 'access'])} ${span.getIn(['data', 'kafka', 'service'])}`;
  }
});
