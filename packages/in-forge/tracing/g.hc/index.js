/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'g.hc',
  category: 'http',

  typeName: {
    singular: 'HTTP Client Call',
    plural: 'HTTP Client Calls'
  },

  detailView: 'GolangHttpClientSpanDetailView',

  getLabel
});
