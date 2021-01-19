/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'sidekiq-worker',
  category: 'messaging',

  typeName: {
    singular: 'Sidekiq Worker',
    plural: 'Sidekiq Workers'
  },

  detailView: 'SidekiqWorkerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'sidekiq-worker', 'job']);
  }
});
