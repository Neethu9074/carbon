import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'file',
  category: 'io',
  direction: 'exit',

  typeName: {
    singular: 'File access',
    plural: 'File accesses'
  },

  detailView: 'FileSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'file', 'access']) + ' ' + span.getIn(['data', 'file', 'path']);
  }
});
