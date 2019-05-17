import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'sdk.rpc.entry',
  category: 'rpc',

  typeName: {
    singular: 'RPC Server',
    plural: 'RPC Server Calls'
  },

  detailView: 'RpcServerDetailView',

  getLabel
});
