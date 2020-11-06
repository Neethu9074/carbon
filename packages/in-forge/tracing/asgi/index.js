import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'asgi',
  category: 'http',

  typeName: {
    singular: 'ASGI',
    plural: 'ASGI Calls'
  },

  detailView: 'AsgiSpanDetailView',

  getLabel
});
