import {registerSpanDefinition} from 'in-sdk/registry/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'hc',

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: '../http/HttpSpanDetailView',

  getLabel
});
