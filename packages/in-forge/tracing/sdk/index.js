import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'sdk',
  category: 'generic',

  typeName: {
    singular: 'Call',
    plural: 'Calls'
  },

  detailView: 'SdkSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'sdk', 'name']);
  }
});
