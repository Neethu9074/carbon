/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 's3',
  category: 'database',

  typeName: {
    singular: 'S3 call',
    plural: 'S3 calls'
  },

  detailView: 'S3SpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 's3', 'op']) + ' ' + span.getIn(['data', 's3', 'bucket']);
  }
});
