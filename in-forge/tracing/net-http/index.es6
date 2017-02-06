import {registerSpanDefinition} from 'in-sdk/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'net-http',
  category: 'http',

  typeName: {
    singular: 'Net::HTTP Request',
    plural: 'Net::HTTP Requests'
  },

  detailView: 'NetHttpSpanDetailView',

  getLabel
});
