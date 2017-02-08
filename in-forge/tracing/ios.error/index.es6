import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'ios.error',
  category: 'eum',
  serviceSideForOverview: 'source',
  showSelfTime: false,

  typeName: {
    singular: 'iOS Error',
    plural: 'iOS Errors'
  },

  detailView: 'IosErrorSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'ios_error', 'report', 'crash', 'diagnosis']);
  }
});
