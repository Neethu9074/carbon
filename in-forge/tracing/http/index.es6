import {registerSpanDefinition} from 'in-sdk/registry/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'http',
  category: 'http',
  direction: 'exit',

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'HttpSpanDetailView',

  getLabel
});
