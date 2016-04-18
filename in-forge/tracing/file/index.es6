import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'file',

  typeName: {
    singular: 'File access',
    plural: 'File accesses'
  },

  getLabel(span) {
    return span.getIn(['data', 'file', 'access']) + ' ' + span.getIn(['data', 'file', 'path']);
  }
});
