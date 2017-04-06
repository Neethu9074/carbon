import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'page',
  category: 'eum',
  serviceSideForOverview: 'source',

  showSelfTime: false,

  typeName: {
    singular: 'Page Request',
    plural: 'Page Requests'
  },

  detailView: 'PageRequestSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'page', 'url']);
  }
});
