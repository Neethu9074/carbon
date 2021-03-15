/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'zipkin',
  category: 'generic',

  typeName: {
    singular: 'Call',
    plural: 'Calls'
  },

  detailView: 'ZipkinSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'service']) + ' ' + span.getIn(['data', 'operation']);
  }
});
