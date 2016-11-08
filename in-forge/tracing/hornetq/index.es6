import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'hornetq',
  category: 'messaging',
  direction(span) {
    const type = span.getIn(['data', 'hornetq', 'type']);
    if (!type) {
      return 'entryAndExit';
    }
    return type.toLowerCase() === 'send' ? 'exit' : 'entry';
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
