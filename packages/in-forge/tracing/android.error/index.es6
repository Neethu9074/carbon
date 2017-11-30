import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'android.error',
  category: 'eum',
  serviceSideForOverview: 'source',
  showSelfTime: false,

  typeName: {
    singular: 'Android Error',
    plural: 'Android Errors'
  },

  detailView: 'AndroidErrorSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'android_error', 'report', 'errorTitle']);
  }
});
