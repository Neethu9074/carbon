import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'OpenEJB',
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
