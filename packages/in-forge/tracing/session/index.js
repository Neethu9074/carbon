/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'session',
  category: 'database',

  typeName: {
    singular: 'Session Call',
    plural: 'Session Calls'
  },

  detailView: 'SessionSpanDetailView',

  getLabel() {
    return 'Session Start';
  }
});
