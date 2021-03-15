/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'wsgi',
  category: 'http',

  typeName: {
    singular: 'WSGI',
    plural: 'WSGI Calls'
  },

  detailView: 'WsgiSpanDetailView',

  getLabel
});
