/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'msmq',
  category: 'messaging',

  typeName: {
    singular: 'MSMQ Message',
    plural: 'MSMQ Messages'
  },

  detailView: 'MSMQSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'msmq', 'queueName']);
  }
});
