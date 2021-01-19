/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'faunadb',
  category: 'database',

  typeName: {
    singular: 'FaunaDB Call',
    plural: 'FaunaDB Calls'
  },

  detailView: 'FaunaDBSpanDetailView',

  getLabel() {
    return 'FaunaDB';
  }
});
