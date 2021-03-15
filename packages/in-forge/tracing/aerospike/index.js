/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'aerospike',
  category: 'cache',

  typeName: {
    singular: 'Aerospike Call',
    plural: 'Aerospike Calls'
  },

  detailView: 'AerospikeSpanDetailView',

  getLabel(span) {
    return 'Aerospike ' + span.getIn(['data', 'aerospike', 'op']);
  }
});
