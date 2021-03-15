/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'resteasy',
  category: 'http',

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'ResteasySpanDetailView',

  getLabel
});
