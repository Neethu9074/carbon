import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'mule.server',
  category: 'http',

  typeName: {
    singular: 'Mule ESB Call',
    plural: 'Mule ESB Calls'
  },

  detailView: 'MuleServerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'mule', 'address']);
  }
});
