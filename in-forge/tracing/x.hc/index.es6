import {registerSpanDefinition} from 'in-sdk/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'x.hc',
  category: 'http',
  direction: 'exit',
  searchAliases: ['xray', 'x-ray', 'http'],

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'XrayHttpClientSpanDetailView',

  getLabel
});
