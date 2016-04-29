import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'jms',

  typeName: {
    singular: 'JMS message',
    plural: 'JMS messages'
  },

  detailView: 'JmsSpanDetailView',

  getLabel(span) {
    const label = span.getIn(['data', 'jms', 'type'], '<unknown type>');
    const destination = span.getIn(['data', 'jms', 'type']);
    if (destination == null) {
      return label;
    }

    return label + ' to ' + destination;
  }
});
