import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';

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
