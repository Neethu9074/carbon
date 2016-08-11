import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'php',
  category: 'http',
  direction: 'entryAndExit',

  typeName: {
    singular: 'PHP request',
    plural: 'PHP requests'
  },

  detailView: 'PhpSpanDetailView',

  getLabel(span) {
    const url = span.getIn(['data', 'http', 'url']);
    const method = span.getIn(['data', 'http', 'method']);

    if (url && method) {
      return method + ' ' + url;
    } else if (url) {
      return url;
    } else if (method) {
      return method;
    }
    return span.getIn(['data', 'php', 'sapi']);
  }
});
