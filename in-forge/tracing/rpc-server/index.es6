import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';

registerSpanDefinition({
  type: 'rpc-server',
  category: 'rpc',

  typeName: {
    singular: 'RPC Server',
    plural: 'RPC Server Calls'
  },

  detailView: 'RpcServerDetailView',

  getLabel
});
