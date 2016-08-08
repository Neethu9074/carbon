import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'rabbitmq',
  category: 'messaging',

  direction(span) {
    return span.getIn(['data', 'rabbitmq', 'sort']) === 'publish' ? 'exit' : 'entry';
  },

  typeName: {
    singular: 'RabbitMQ message',
    plural: 'RabbitMQ messages'
  },

  detailView: 'RabbitMqSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'rabbitmq', 'key']);
  }
});
