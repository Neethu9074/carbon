/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'rabbitmq',
  category: 'messaging',

  typeName: {
    singular: 'RabbitMQ message',
    plural: 'RabbitMQ messages'
  },

  detailView: 'RabbitMqSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'rabbitmq', 'key']);
  }
});
