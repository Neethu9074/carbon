/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'asgi',
  category: 'http',

  typeName: {
    singular: 'ASGI',
    plural: 'ASGI Calls'
  },

  detailView: 'AsgiSpanDetailView',

  getLabel
});
