/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'urllib3',
  category: 'http',

  typeName: {
    singular: 'urllib3 Request',
    plural: 'urllib3 Requests'
  },

  detailView: 'Urllib3SpanDetailView',

  getLabel
});
