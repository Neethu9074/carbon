import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'wcfclient',
  category: 'remote',

  typeName: {
    singular: 'WCF-Call',
    plural: 'WCF-Calls'
  },

  detailView: 'WcfClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'wcfclient', 'contract']) + '.' + span.getIn(['data', 'wcfclient', 'method']);
  }
});
