import {registerSpanDefinition} from 'in-sdk/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'excon',
  category: 'http',
  searchAliases: ['http', 'httpclient', 'excon'],

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'ExconSpanDetailView',

  getLabel
});
