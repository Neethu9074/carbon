import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/http/spanDefinition';

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
