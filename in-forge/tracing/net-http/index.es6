import {registerSpanDefinition} from 'in-sdk/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'net-http',
  category: 'http',
  direction: 'exit',

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'NetHttpSpanDetailView',

  getLabel
});
