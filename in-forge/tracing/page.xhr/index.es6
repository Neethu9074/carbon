import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'page.xhr',
  category: 'http',
  serviceSideForOverview: 'source',

  typeName: {
    singular: 'XMLHttpRequest',
    plural: 'XMLHttpRequests'
  },

  detailView: 'XhrSpanDetailView',

  getLabel
});
