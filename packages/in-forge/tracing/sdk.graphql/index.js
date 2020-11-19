import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'sdk.graphql',
  category: 'graphql',

  typeName: {
    singular: 'GraphQL',
    plural: 'GraphQL'
  },

  detailView: 'GraphQlSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'graphql', 'operationName']);
  }
});
