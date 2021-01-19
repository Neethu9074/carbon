/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';

registerSpanDefinition({
  type: 'oncrpc.server',
  category: 'rpc',

  typeName: {
    singular: 'RPC Server',
    plural: 'RPC Server Calls'
  },

  detailView: 'OncRpcServerDetailView',

  getLabel
});
