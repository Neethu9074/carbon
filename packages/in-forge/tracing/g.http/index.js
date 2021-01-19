/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'g.http',
  category: 'http',

  typeName: {
    singular: 'HTTP Server Call',
    plural: 'HTTP Server Calls'
  },

  detailView: 'GolangHttpServerSpanDetailView',

  getLabel
});
