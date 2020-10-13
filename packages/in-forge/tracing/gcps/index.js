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
    return ['op', 'top', 'sub']
      .map(key => span.getIn(['data', 'gcps', key]))
      .filter(tag => tag)
      .join(' ');
  }
});
