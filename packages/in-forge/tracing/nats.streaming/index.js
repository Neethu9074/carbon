/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';
import getLabel from 'in-forge/tracing/nats/label';

registerSpanDefinition({
  type: 'nats.streaming',
  category: 'messaging',

  typeName: {
    singular: 'NATS streaming message',
    plural: 'NATS streaming messages'
  },

  detailView: 'NatsStreamingSpanDetailView',

  getLabel
});
