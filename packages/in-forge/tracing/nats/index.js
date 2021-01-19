/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';
import getLabel from 'in-forge/tracing/nats/label';

registerSpanDefinition({
  type: 'nats',
  category: 'messaging',

  typeName: {
    singular: 'NATS message',
    plural: 'NATS messages'
  },

  detailView: 'NatsSpanDetailView',

  getLabel
});
