/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'batch-synthetic',
  category: 'batch',

  typeName: {
    singular: 'Internal trigger',
    plural: 'Internal triggers'
  },

  detailView: 'SyntheticBatchSpanDetailView',

  getLabel() {
    return 'Internal trigger';
  }
});
