import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'gcd',
  category: 'database',

  typeName: {
    singular: 'Google Cloud Datastore call',
    plural: 'Google Cloud Datastore calls'
  },

  detailView: 'GCDSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'gcd', 'op']) + ' ' + span.getIn(['data', 'gcd', 'mode']);
  }
});
