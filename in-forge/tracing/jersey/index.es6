import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'jersey',

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  getLabel(span) {
    return span.getIn(['data', 'http', 'url']);
  }
});
