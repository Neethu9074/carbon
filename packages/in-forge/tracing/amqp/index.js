/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'amqp',
  category: 'messaging',

  typeName: {
    singular: 'AMQP Message',
    plural: 'AMQP Messages'
  },

  detailView: 'AmqpSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'amqp', 'command']);
  }
});
