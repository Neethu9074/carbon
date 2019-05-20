import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'java.rmi.entry',
  category: 'rpc',

  typeName: {
    singular: 'RPC Call',
    plural: 'RPC Calls'
  },

  detailView: 'RmiEntrySpanDetailView'
});
