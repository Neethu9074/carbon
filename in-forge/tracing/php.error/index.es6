import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'php.error',
  category: 'logger',
  direction: 'exit',

  typeName: {
    singular: 'PHP Error',
    plural: 'PHP Errors'
  },

  detailView: 'PhpErrorSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'error', 'msg']);
  }
});
