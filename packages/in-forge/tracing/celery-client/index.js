import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'celery-client',
  category: 'messaging',

  typeName: {
    singular: 'Celery Client Call',
    plural: 'Celery Client Calls'
  },

  detailView: 'CeleryClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'celery', 'task']);
  }
});
