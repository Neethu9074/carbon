import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'page.res',
  category: 'eumResource',
  direction: 'exit',
  serviceSideForOverview: 'source',
  showSelfTime: false,

  typeName: {
    singular: 'Resource Request',
    plural: 'Resource Requests'
  },

  detailView: 'PageResourceRequestSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'page_res', 'url']);
  }
});
