import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'corba',

  typeName: {
    singular: 'Corba call',
    plural: 'Corba calls'
  },

  detailView: 'CorbaSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'corba', 'method']);
  }
});
