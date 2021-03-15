/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'rpc-client',
  category: 'rpc',

  typeName: {
    singular: 'RPC Client',
    plural: 'RPC Client Calls'
  },

  detailView: 'RpcClientDetailView',

  getLabel
});
