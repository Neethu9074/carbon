import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'shell',
  category: 'http',

  typeName: {
    singular: 'Shell Call',
    plural: 'Shell Calls'
  },

  detailView: 'ShellSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'shell', 'cmd']);
  }
});
