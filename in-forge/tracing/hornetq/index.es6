import {registerSpanDefinition} from 'in-sdk/tracing';


registerSpanDefinition({
  type: 'hornetq',
  category: 'messaging',

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
