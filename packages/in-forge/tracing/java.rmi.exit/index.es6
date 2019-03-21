import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'java.rmi.exit',
  category: 'rpc',

  typeName: {
    singular: 'RPC Call',
    plural: 'RPC Calls'
  },

  detailView: 'RmiExitSpanDetailView'
});
