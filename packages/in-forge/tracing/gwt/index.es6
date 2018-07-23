import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'gwt',
  category: 'rpc',

  typeName: {
    singular: 'RPC Call',
    plural: 'RPC Calls'
  },

  detailView: 'GwtSpanDetailView',

  getLabel
});
