import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'quartz',
  category: 'batch',

  typeName: {
    singular: 'Quartz Job',
    plural: 'Quartz Jobs'
  },

  detailView: 'QuartzSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'name']);
  }
});
