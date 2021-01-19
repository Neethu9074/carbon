/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'celery-worker',
  category: 'messaging',

  typeName: {
    singular: 'Celery Worker Call',
    plural: 'Celery Worker Calls'
  },

  detailView: 'CeleryWorkerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'celery', 'task']);
  }
});
