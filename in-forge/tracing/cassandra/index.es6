import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'cassandra',
  category: 'database',
  direction: 'exit',

  typeName: {
    singular: 'Cassandra query',
    plural: 'Cassandra queries'
  },

  detailView: 'CassandraSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'cassandra', 'query']);
  }
});
