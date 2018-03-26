import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'couchbase',
  category: 'database',

  typeName: {
    singular: 'Couchbase Call',
    plural: 'Couchbase Calls'
  },

  detailView: 'CouchbaseSpanDetailView',

  getLabel(span) {
    return 'Couchbase ' + span.getIn(['data', 'couchbase', 'type']);
  }
});
