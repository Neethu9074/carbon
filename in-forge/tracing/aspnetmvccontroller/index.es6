import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'aspnetmvccontroller',
  category: 'generic',
  searchAliases: ['aspmvc', 'aspnetmvc', 'mvccontroller'],

  typeName: {
    singular: 'ASP.Net MVC-Controller',
    plural: 'ASP.Net MVC-Controllers'
  },

  detailView: 'AspNetMvcControllerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'aspnetmvccontroller', 'controller']);
  }
});
