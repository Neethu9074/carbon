import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'celery-worker',
  category: 'messaging',

  typeName: {
    singular: 'Celery Worker',
    plural: 'Celery Workers'
  },

  detailView: 'CeleryWorkerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'celery', 'task']);
  }
});
