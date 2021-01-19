/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'sdk.batch',
  category: 'batch',

  typeName: {
    singular: 'Batch Job',
    plural: 'Batch Jobs'
  },

  detailView: 'BatchSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'batch', 'job']);
  }
});
