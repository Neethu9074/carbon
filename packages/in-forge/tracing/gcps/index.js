import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'gcps',
  category: 'messaging',

  typeName: {
    singular: 'Google Cloud PubSub',
    plural: 'Google Cloud PubSub'
  },

  detailView: 'GCPSSpanDetailView',

  getLabel(span) {
    return `${span.getIn(['data', 'gcps', 'op'])} ${span.getIn(['data', 'gcps', 'top'])}`;
  }
});
