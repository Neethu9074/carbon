import {registerSpanDefinition} from 'in-sdk/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'rack',
  category: 'http',
  direction: 'entry',
  searchAliases: ['ruby', 'rack', 'http'],

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'RackSpanDetailView',

  getLabel
});
