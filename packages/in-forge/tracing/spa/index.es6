import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'spa',
  category: 'eum',
  serviceSideForOverview: 'source',

  typeName: {
    singular: 'SPA Page Transition',
    plural: 'SPA Page Transitions'
  },

  detailView: 'SpaSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'spa', 'url']);
  }
});
