import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'elasticsearch',
  category: 'database',

  typeName: {
    singular: 'Elasticsearch Call',
    plural: 'Elasticsearch Calls'
  },

  detailView: 'ElasticsearchSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'elasticsearch', 'action']);
  }
});
