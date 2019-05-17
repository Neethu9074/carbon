import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'ratpack.client',
  category: 'http',

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'RatpackClientSpanDetailView',

  getLabel
});
