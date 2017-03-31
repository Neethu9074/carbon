import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'camel',
  category: 'messaging',
  searchAliases: ['camel'],

  typeName: {
    singular: 'Camel Call',
    plural: 'Camel Call'
  },

  detailView: 'CamelSpanDetailView',

  getLabel(span) {
    return 'Type ' + span.getIn(['data', 'camel', 'type']);
  }
});
