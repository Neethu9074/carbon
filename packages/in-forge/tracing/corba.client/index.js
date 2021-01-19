/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'corba.client',
  category: 'remote',

  typeName: {
    singular: 'Corba call',
    plural: 'Corba calls'
  },

  detailView: 'CorbaClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'corba', 'method']);
  }
});
