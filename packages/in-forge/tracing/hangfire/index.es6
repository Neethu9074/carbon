import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'hangfire',
  category: 'batch',

  typeName: {
    singular: 'Hangfire Job',
    plural: 'Hangfire Jobs'
  },

  detailView: 'HangfireSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'hangfire', 'jobname']);
  }
});
