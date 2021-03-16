/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'aiohttp-server',
  category: 'http',

  typeName: {
    singular: 'AIOHTTP Server Call',
    plural: 'AIOHTTP Server Calls'
  },

  detailView: 'AioHttpServerSpanDetailView',

  getLabel
});
