import {registerSpanDefinition} from 'in-sdk/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'node.http.client',
  category: 'http',
  direction: 'exit',
  searchAliases: ['node', 'node.js', 'http'],

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'NodejsHttpClientSpanDetailView',

  getLabel
});
