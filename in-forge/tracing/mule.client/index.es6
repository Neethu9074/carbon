import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'mule.client',
  category: 'http',

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'MuleClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'mule', 'address']);
  }
});
