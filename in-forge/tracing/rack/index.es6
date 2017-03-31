import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'rack',
  category: 'http',
  searchAliases: ['ruby', 'rack', 'http'],

  typeName: {
    singular: 'Rack',
    plural: 'Rack Calls'
  },

  detailView: 'RackSpanDetailView',

  getLabel
});
