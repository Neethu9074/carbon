/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'hz',
  category: 'database',

  typeName: {
    singular: 'Hazelcast Java Client call',
    plural: 'Hazelcast Java Client calls'
  },

  detailView: 'HzSpanDetailView'
});
