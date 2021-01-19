/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
