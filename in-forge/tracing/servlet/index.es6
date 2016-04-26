import {registerSpanDefinition} from 'in-sdk/registry/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'servlet',

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'ServletSpanDetailView',

  getLabel
});
