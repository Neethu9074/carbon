import {registerSpanDefinition} from 'in-sdk/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'g.http',
  category: 'http',
  searchAliases: ['go', 'golang', 'http'],

  typeName: {
    singular: 'HTTP Server Call',
    plural: 'HTTP Server Calls'
  },

  detailView: 'GolangHttpServerSpanDetailView',

  getLabel
});
