import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'wcf',
  category: 'remote',

  typeName: {
    singular: 'WCF-Service',
    plural: 'WCF-Services'
  },

  detailView: 'WcfApiSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'wcf', 'svcclass']) + '.' + span.getIn(['data', 'wcf', 'svcmethod']);
  }
});
