import {registerSpanDefinition} from 'in-sdk/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'play2.ws',
  category: 'http',
  direction: 'entry',
  searchAliases: ['play', 'http'],

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'PlayWsSpanDetailView',

  getLabel
});
