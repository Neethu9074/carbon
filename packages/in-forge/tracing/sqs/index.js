/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'sqs',
  category: 'messaging',

  typeName: {
    singular: 'SQS message',
    plural: 'SQS messages'
  },

  detailView: 'SqsSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'sqs', 'queue']);
  }
});
