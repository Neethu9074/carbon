import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'gwt',
  category: 'http',

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'GwtSpanDetailView',

  getLabel
});
