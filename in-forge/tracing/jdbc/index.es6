import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'jdbc',
  category: 'database',

  typeName: {
    singular: 'JDBC Call',
    plural: 'JDBC Calls'
  },

  detailView: 'JdbcSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'jdbc', 'statement']) || span.getIn(['data', 'jdbc', 'connection']);
  }
});
