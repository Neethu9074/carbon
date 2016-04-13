import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'jdbc',

  typeName: {
    singular: 'JDBC Call',
    plural: 'JDBC Calls'
  },

  getLabel(span) {
    return span.getIn(['data', 'jdbc.statement']);
  }
});
