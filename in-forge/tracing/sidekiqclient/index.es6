import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'sidekiqclient',
  category: 'messaging',
  direction: 'local',

  typeName: {
    singular: 'Sidekiq Client',
    plural: 'Sidekiq Client Calls'
  },

  detailView: 'SidekiqClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'sidekiqclient', 'job']);
  }
});
