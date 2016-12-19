import {registerSpanDefinition} from 'in-sdk/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'x.http',
  category: 'http',
  direction: 'entry',
  searchAliases: ['xray', 'x-ray', 'http'],

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'XrayHttpServerSpanDetailView',

  getLabel
});
