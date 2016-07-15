import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'kafka',
  category: 'messaging',
  direction: 'exit',

  typeName: {
    singular: 'Kafka',
    plural: 'Kafka'
  },

  detailView: 'KafkaSpanDetailView',

  getLabel(span) {
    return `${span.getIn(['data', 'kafka', 'access'])} ${span.getIn(['data', 'kafka', 'service'])}`;
  }
});
