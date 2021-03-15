/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'rpc',
  category: 'rpc',

  typeName: {
    singular: 'RPC Call',
    plural: 'RPC Calls'
  },

  detailView: 'RpcSpanDetailView',

  getLabel
});
