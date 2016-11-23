import {registerSpanDefinition} from 'in-sdk/tracing';
import {getLabel} from 'in-forge/tracing/rpc/spanDefinition';

registerSpanDefinition({
  type: 'g.rpc',
  category: 'rpc',
  direction: 'entry',
  searchAliases: ['go', 'golang', 'rpc'],

  typeName: {
    singular: 'RPC Call',
    plural: 'RPC Calls'
  },

  detailView: 'GolangRpcServerSpanDetailView',

  getLabel
});
