/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'akka-remote-entry',
  category: 'rpc',

  typeName: {
    singular: 'Akka Message',
    plural: 'Akka Messages'
  },

  detailView: 'AkkaRemoteSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'akka', 'msg']);
  }
});
