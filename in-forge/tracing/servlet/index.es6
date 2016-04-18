import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'servlet',

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  getLabel(span) {
    const url = span.getIn(['data', 'http.url']);
    const method = span.getIn(['data', 'http.method']);

    if (url && method) {
      return method + ' ' + url;
    } else if (url) {
      return url;
    } else if (method) {
      return method;
    }
    return null;
  }
});
