import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'php',

  typeName: {
    singular: 'PHP request',
    plural: 'PHP requests'
  },

  detailView: 'PhpSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'php', 'sapi']);
  }
});
