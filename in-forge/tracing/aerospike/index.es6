import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'aerospike',
  category: 'database',

  typeName: {
    singular: 'Aerospike Call',
    plural: 'Aerospike Calls'
  },

  detailView: 'AerospikeSpanDetailView',

  getLabel(span) {
    return 'Aerospike ' + span.getIn(['data', 'aerospike', 'op']);
  }
});
