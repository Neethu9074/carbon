import {SPAN_KINDS, registerSpanDefinition} from 'in-sdk/tracing';


registerSpanDefinition({
  type: 'hornetq',
  category: 'messaging',
  direction(span) {
    const type = span.getIn(['data', 'hornetq', 'type']);
    if (!type) {
      return SPAN_KINDS.INTERMEDIATE;
    }
    return type.toLowerCase() === 'send' ? SPAN_KINDS.EXIT : SPAN_KINDS.ENTRY;
  },

  typeName: {
    singular: 'HornetQ message',
    plural: 'HornetQ messages'
  },

  detailView: 'HornetQSpanDetailView',

  getLabel(span) {
    const label = span.getIn(['data', 'hornetq', 'type'], '<unknown>');
    return 'HornetQ ' + label;
  }
});
