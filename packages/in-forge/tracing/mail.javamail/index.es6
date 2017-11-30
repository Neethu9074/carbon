import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'mail.javamail',
  category: 'messaging',

  typeName: {
    singular: 'Mail message',
    plural: 'Mail messages'
  },

  detailView: 'JavamailSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'mail', 'type'], '<unknown type>');
  }
});
