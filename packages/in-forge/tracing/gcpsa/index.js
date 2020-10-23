import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'gcpsa',
  category: 'generic',

  typeName: {
    singular: 'Google Cloud PubSub',
    plural: 'Google Cloud PubSub'
  },

  detailView: 'GCPSASpanDetailView',

  getLabel(span) {
    return ['op', 'snap', 'sub', 'top']
      .map(key => span.getIn(['data', 'gcpsa', key]))
      .filter(tag => tag)
      .join(' ');
  }
});
