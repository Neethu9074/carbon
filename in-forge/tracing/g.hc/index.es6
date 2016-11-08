import {registerSpanDefinition} from 'in-sdk/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'g.hc',
  category: 'http',
  direction: 'exit',
  searchAliases: ['go', 'golang', 'http'],

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'GolangHttpClientSpanDetailView',

  getLabel
});
