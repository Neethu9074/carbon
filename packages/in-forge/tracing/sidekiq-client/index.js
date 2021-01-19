/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'sidekiq-client',
  category: 'messaging',

  typeName: {
    singular: 'Sidekiq Client',
    plural: 'Sidekiq Client Calls'
  },

  detailView: 'SidekiqClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'sidekiq-client', 'job']);
  }
});
