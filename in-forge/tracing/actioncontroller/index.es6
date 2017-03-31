import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'actioncontroller',
  category: 'generic',

  typeName: {
    singular: 'ActionController',
    plural: 'ActionController Calls'
  },

  detailView: 'ActionControllerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'actioncontroller', 'controller']) +
      '#' +
      span.getIn(['data', 'actioncontroller', 'action']);
  }
});
