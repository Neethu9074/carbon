/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';

registerSpanDefinition({
  type: 'oncrpc.client',
  category: 'rpc',

  typeName: {
    singular: 'RPC Client',
    plural: 'RPC Client Calls'
  },

  detailView: 'OncRpcClientDetailView',

  getLabel
});
