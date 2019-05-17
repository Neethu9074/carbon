import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'aiohttp-client',
  category: 'http',

  typeName: {
    singular: 'AIOHTTP Client Request',
    plural: 'AIOHTTP Client Requests'
  },

  detailView: 'AioHttpSpanDetailView',

  getLabel
});
