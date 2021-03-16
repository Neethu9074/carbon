/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'resque-worker',
  category: 'messaging',

  typeName: {
    singular: 'Resque Worker',
    plural: 'Resque Workers'
  },

  detailView: 'ResqueWorkerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'resque-worker', 'job']);
  }
});
