import {registerSpanDefinition} from 'in-sdk/registry/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'play2',
  category: 'http',

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'Play2SpanDetailView',

  getLabel
});
