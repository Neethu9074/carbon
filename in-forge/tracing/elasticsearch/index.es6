import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'elasticsearch',

  typeName: {
    singular: 'Elasticsearch Call',
    plural: 'Elasticsearch Calls'
  },

  detailView: 'ElasticsearchSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'elasticsearch', 'action']);
  }
});
