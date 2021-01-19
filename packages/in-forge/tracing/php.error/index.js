/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'php.error',
  category: 'logger',

  typeName: {
    singular: 'PHP Error',
    plural: 'PHP Errors'
  },

  detailView: 'PhpErrorSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'error', 'msg']);
  }
});
