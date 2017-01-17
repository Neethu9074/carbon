import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'webapi',
  category: 'generic',
  direction:'entryAndExit',
  searchAliases: ['webapi'],

  typeName: {
    singular: 'WebAPI-Controller',
    plural: 'WebAPI-Controllers'
  },

  detailView: 'WebApiSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'webapi', 'controller']);
  }
});
