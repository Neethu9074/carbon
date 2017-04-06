import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'php',
  category: 'http',

  typeName: {
    singular: 'PHP request',
    plural: 'PHP requests'
  },

  detailView: 'PhpSpanDetailView',

  getLabel(span) {
    const url = span.getIn(['data', 'http', 'url']);
    const method = span.getIn(['data', 'http', 'method']);
    const script = span.getIn(['data', 'php', 'script']);

    if (url && method) {
      return method + ' ' + url;
    } else if (url) {
      return url;
    } else if (method) {
      return method;
    } else if (script) {
      return script;
    }
    return span.getIn(['data', 'php', 'sapi']);
  }
});
