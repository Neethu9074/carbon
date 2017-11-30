import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'sidekiq-worker',
  category: 'messaging',
  direction: 'local',

  typeName: {
    singular: 'Sidekiq Worker',
    plural: 'Sidekiq Job Processing'
  },

  detailView: 'SidekiqWorkerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'sidekiq-worker', 'job']);
  }
});
