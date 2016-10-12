import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'ejb',
  category: 'remote',
  direction: 'entryAndExit',

  typeName: {
    singular: 'Enterprise Java Bean',
    plural: 'Enterprise Java Beans'
  },

  detailView: 'EJBSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'ejb', 'method']);
  }
});
