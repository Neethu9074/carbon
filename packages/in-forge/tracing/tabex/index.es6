import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'tabex',
  category: 'database',

  typeName: {
    singular: 'Tabex call',
    plural: 'Tabex calls'
  },

  detailView: 'TabexSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'tabex', 'con']);
  }
});
