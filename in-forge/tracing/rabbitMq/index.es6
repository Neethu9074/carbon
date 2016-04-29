import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'rabbitmq',

  typeName: {
    singular: 'RabbitMQ message',
    plural: 'RabbitMQ messages'
  },

  detailView: 'RabbitMqSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'rabbitmq', 'key']);
  }
});
