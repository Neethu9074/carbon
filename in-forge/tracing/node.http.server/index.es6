import {registerSpanDefinition} from 'in-sdk/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'node.http.server',
  category: 'http',
  searchAliases: ['node', 'node.js', 'http'],

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'NodejsHttpServerSpanDetailView',

  getLabel
});
