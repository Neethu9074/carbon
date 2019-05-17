import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'spring-rest',
  category: 'http',

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'SpringRestSpanDetailView',

  getLabel
});
