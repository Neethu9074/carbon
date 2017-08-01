import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'wsgi',
  category: 'http',

  typeName: {
    singular: 'WSGI',
    plural: 'WSGI Calls'
  },

  detailView: 'WsgiSpanDetailView',

  getLabel
});
