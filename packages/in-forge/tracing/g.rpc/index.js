/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';

registerSpanDefinition({
  type: 'g.rpc',
  category: 'rpc',

  typeName: {
    singular: 'RPC Call',
    plural: 'RPC Calls'
  },

  detailView: 'GolangRpcServerSpanDetailView',

  getLabel
});
