/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'tornado-server',
  category: 'http',

  typeName: {
    singular: 'Tornado Server Call',
    plural: 'Tornado Server Calls'
  },

  detailView: 'TornadoServerSpanDetailView',

  getLabel
});
