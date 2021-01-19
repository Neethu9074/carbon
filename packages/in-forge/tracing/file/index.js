/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'file',
  category: 'io',

  typeName: {
    singular: 'File access',
    plural: 'File accesses'
  },

  detailView: 'FileSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'file', 'access']) + ' ' + span.getIn(['data', 'file', 'path']);
  }
});
