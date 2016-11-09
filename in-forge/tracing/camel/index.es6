import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'camel',
  category: 'messaging',
  direction: 'entry',

  typeName: {
    singular: 'Camel call',
    plural: 'Camel call'
  },

  detailView: 'CamelSpanDetailView',

  getLabel(span) {
    return 'Type ' + span.getIn(['data', 'camel', 'type']);
  }
});
