import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'page.res',
  category: 'eum',
  direction: 'exit',

  typeName: {
    singular: 'Page Resource Request',
    plural: 'Page Resource Requests'
  },

  detailView: 'PageResourceRequestSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'page.res', 'url']);
  }
});
