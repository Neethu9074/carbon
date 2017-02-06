import {registerSpanDefinition} from 'in-sdk/tracing';


registerSpanDefinition({
  type: 'kafka',
  category: 'messaging',

  typeName: {
    singular: 'Kafka',
    plural: 'Kafka'
  },

  detailView: 'KafkaSpanDetailView',

  getLabel(span) {
    return `${span.getIn(['data', 'kafka', 'access'])} ${span.getIn(['data', 'kafka', 'service'])}`;
  }
});
