/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'sdk.messaging',
  category: 'messaging',

  typeName: {
    singular: 'Messaging Call',
    plural: 'Messaging Calls'
  },

  detailView: 'MessagingSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'messaging', 'destination']);
  }
});
