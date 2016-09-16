import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'page',
  category: 'eum',
  direction: 'entry',
  searchAliases: ['page', 'eum'],

  typeName: {
    singular: 'Page Request',
    plural: 'Page Requests'
  },

  detailView: 'PageRequestSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'page', 'url']);
  }
});
