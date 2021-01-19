/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'jms',
  category: 'messaging',

  typeName: {
    singular: 'JMS message',
    plural: 'JMS messages'
  },

  detailView: 'JmsSpanDetailView',

  getLabel(span) {
    const label = span.getIn(['data', 'jms', 'message'], '<unknown>');
    const destination = span.getIn(['data', 'jms', 'destination']);
    if (destination == null) {
      return label;
    }

    return label + ' to ' + destination;
  }
});
