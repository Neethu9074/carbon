/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'tornado-client',
  category: 'http',

  typeName: {
    singular: 'Tornado Client Request',
    plural: 'Tornado Client Requests'
  },

  detailView: 'TornadoClientSpanDetailView',

  getLabel
});
